import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

import { estimateScoreDelta, evaluateProjectQuality, sortByRiskDesc } from "@/lib/scoring";
import {
  ActionItem,
  DashboardStats,
  PlaybookDay,
  RepoProject,
  ScanPayload,
  TimelineEvent,
} from "@/lib/types";

const execFileAsync = promisify(execFile);

function parsePositiveInt(raw: string | undefined, fallback: number): number {
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
}

const SCAN_ROOT = process.env.REPO_NAVIGATOR_SCAN_ROOT ?? "C:\\Users\\wwwhi\\Create";
const CACHE_TTL_MS = parsePositiveInt(process.env.REPO_NAVIGATOR_CACHE_TTL_MS, 300_000);
const MAX_PROJECTS = parsePositiveInt(process.env.REPO_NAVIGATOR_SCAN_LIMIT, 30);
const MAX_SCAN_DEPTH = parsePositiveInt(process.env.REPO_NAVIGATOR_SCAN_DEPTH, 4);
const MAX_TODO_FILES = parsePositiveInt(process.env.REPO_NAVIGATOR_TODO_SCAN_LIMIT, 60);
const MAX_TODO_FILE_BYTES = parsePositiveInt(
  process.env.REPO_NAVIGATOR_TODO_MAX_FILE_BYTES,
  128 * 1024,
);
const SCAN_CONCURRENCY = parsePositiveInt(process.env.REPO_NAVIGATOR_SCAN_CONCURRENCY, 4);
const DISK_CACHE_PATH = path.join(process.cwd(), ".cache", "repo-scan.json");

const SKIP_DIRS = new Set([
  ".git",
  "node_modules",
  ".next",
  "dist",
  "build",
  "__pycache__",
  ".venv",
  "venv",
]);

const SOURCE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".py"]);
const TODO_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".py", ".md"]);

const STACK_RULES: Array<[string, string]> = [
  ["next", "Next.js"],
  ["react", "React"],
  ["typescript", "TypeScript"],
  ["tailwindcss", "Tailwind CSS"],
  ["zustand", "Zustand"],
  ["framer-motion", "Framer Motion"],
  ["recharts", "Recharts"],
  ["fastapi", "FastAPI"],
  ["sqlalchemy", "SQLAlchemy"],
  ["redis", "Redis"],
  ["celery", "Celery"],
  ["duckdb", "DuckDB"],
  ["openai", "OpenAI"],
  ["langchain", "LangChain"],
  ["websockets", "WebSocket"],
];

type CacheState = {
  expiresAt: number;
  payload: ScanPayload | null;
};

type DiskCache = {
  savedAt: number;
  payload: ScanPayload;
};

type GitSnapshot = {
  dirtyFiles: number;
  lastCommitAt: string | null;
  lastCommitMessage: string | null;
};

type FileMetrics = {
  sourceFiles: number;
  todoCount: number;
};

const cache: CacheState = {
  expiresAt: 0,
  payload: null,
};

let inflightRefresh: Promise<ScanPayload> | null = null;

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toDisplayName(dirName: string): string {
  return dirName
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function toDaysSince(iso: string | null): number | null {
  if (!iso) return null;
  const ts = Date.parse(iso);
  if (Number.isNaN(ts)) return null;
  return Math.max(0, Math.floor((Date.now() - ts) / (1000 * 60 * 60 * 24)));
}

async function safeReadFile(filePath: string): Promise<string | null> {
  try {
    return await fs.readFile(filePath, "utf-8");
  } catch {
    return null;
  }
}

async function safeExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function runGit(projectPath: string, args: string[]): Promise<string | null> {
  try {
    const { stdout } = await execFileAsync("git", ["-C", projectPath, ...args], {
      windowsHide: true,
      timeout: 3000,
      maxBuffer: 1024 * 1024,
    });
    return stdout.trim();
  } catch {
    return null;
  }
}

async function readDiskCache(): Promise<DiskCache | null> {
  const raw = await safeReadFile(DISK_CACHE_PATH);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as DiskCache;
    if (!parsed || typeof parsed.savedAt !== "number" || !parsed.payload) return null;
    if (!Array.isArray(parsed.payload.projects)) return null;
    return parsed;
  } catch {
    return null;
  }
}

async function writeDiskCache(payload: ScanPayload): Promise<void> {
  try {
    await fs.mkdir(path.dirname(DISK_CACHE_PATH), { recursive: true });
    const data: DiskCache = { savedAt: Date.now(), payload };
    await fs.writeFile(DISK_CACHE_PATH, JSON.stringify(data), "utf-8");
  } catch {
    // Cache write is best-effort.
  }
}

async function collectDirEntries(rootPath: string): Promise<string[]> {
  const entries = await fs.readdir(rootPath, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b))
    .slice(0, MAX_PROJECTS);
}

async function collectFileMetrics(projectPath: string): Promise<FileMetrics> {
  let sourceFiles = 0;
  let todoCount = 0;
  let todoFileVisits = 0;

  async function walk(current: string, depth: number): Promise<void> {
    if (depth > MAX_SCAN_DEPTH) return;
    let entries;
    try {
      entries = await fs.readdir(current, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (SKIP_DIRS.has(entry.name)) continue;
      const fullPath = path.join(current, entry.name);

      if (entry.isDirectory()) {
        await walk(fullPath, depth + 1);
        continue;
      }

      const ext = path.extname(entry.name).toLowerCase();
      if (SOURCE_EXTENSIONS.has(ext)) {
        sourceFiles += 1;
      }

      if (!TODO_EXTENSIONS.has(ext) || todoFileVisits >= MAX_TODO_FILES) {
        continue;
      }

      todoFileVisits += 1;
      try {
        const stat = await fs.stat(fullPath);
        if (stat.size > MAX_TODO_FILE_BYTES) continue;
      } catch {
        continue;
      }

      const content = await safeReadFile(fullPath);
      if (!content) continue;
      const matches = content.match(/TODO|FIXME/gi);
      todoCount += matches?.length ?? 0;
    }
  }

  await walk(projectPath, 0);
  return { sourceFiles, todoCount };
}

function detectFromText(content: string, found: Set<string>): void {
  const lower = content.toLowerCase();
  for (const [needle, label] of STACK_RULES) {
    if (lower.includes(needle)) found.add(label);
  }
}

async function detectStack(projectPath: string): Promise<string[]> {
  const found = new Set<string>();
  const candidates = await Promise.all([
    safeReadFile(path.join(projectPath, "package.json")),
    safeReadFile(path.join(projectPath, "requirements.txt")),
    safeReadFile(path.join(projectPath, "pyproject.toml")),
    safeReadFile(path.join(projectPath, "backend", "requirements.txt")),
    safeReadFile(path.join(projectPath, "backend", "pyproject.toml")),
  ]);

  for (const content of candidates) {
    if (content) detectFromText(content, found);
  }

  return [...found];
}

function inferArchitecture(stack: string[]): RepoProject["architecture"] {
  const lower = stack.map((item) => item.toLowerCase());
  const hasFrontend = lower.some((item) => ["next.js", "react", "tailwind css"].includes(item));
  const hasBackend = lower.some((item) => ["fastapi", "sqlalchemy", "redis", "celery"].includes(item));

  if (hasFrontend && hasBackend) return "full-stack";
  if (hasFrontend) return "frontend";
  if (hasBackend) return "backend";
  return "utility";
}

async function detectQualityFlags(projectPath: string): Promise<{
  hasReadme: boolean;
  hasTests: boolean;
  hasDocker: boolean;
}> {
  const checks = await Promise.all([
    safeExists(path.join(projectPath, "README.md")),
    safeExists(path.join(projectPath, "readme.md")),
    safeExists(path.join(projectPath, "tests")),
    safeExists(path.join(projectPath, "__tests__")),
    safeExists(path.join(projectPath, "backend", "tests")),
    safeExists(path.join(projectPath, "Dockerfile")),
    safeExists(path.join(projectPath, "docker-compose.yml")),
    safeExists(path.join(projectPath, "docker-compose.yaml")),
  ]);

  return {
    hasReadme: checks[0] || checks[1],
    hasTests: checks[2] || checks[3] || checks[4],
    hasDocker: checks[5] || checks[6] || checks[7],
  };
}

async function isProjectDirectory(projectPath: string): Promise<boolean> {
  const checks = await Promise.all([
    safeExists(path.join(projectPath, "package.json")),
    safeExists(path.join(projectPath, "requirements.txt")),
    safeExists(path.join(projectPath, "pyproject.toml")),
    safeExists(path.join(projectPath, "backend", "requirements.txt")),
    safeExists(path.join(projectPath, ".git")),
  ]);
  return checks.some(Boolean);
}

async function getGitSnapshot(projectPath: string): Promise<GitSnapshot> {
  const [status, log] = await Promise.all([
    runGit(projectPath, ["status", "--porcelain", "-uno"]),
    runGit(projectPath, ["log", "-1", "--format=%cI%x1f%s"]),
  ]);

  let lastCommitAt: string | null = null;
  let lastCommitMessage: string | null = null;
  if (log) {
    const [commitAt, commitMessage] = log.split("\x1f");
    lastCommitAt = commitAt || null;
    lastCommitMessage = commitMessage || null;
  }

  return {
    dirtyFiles: status ? status.split(/\r?\n/).filter(Boolean).length : 0,
    lastCommitAt,
    lastCommitMessage,
  };
}

async function scanProject(projectPath: string): Promise<RepoProject | null> {
  if (!(await isProjectDirectory(projectPath))) return null;

  const dirName = path.basename(projectPath);
  const [stack, fileMetrics, qualityFlags, git] = await Promise.all([
    detectStack(projectPath),
    collectFileMetrics(projectPath),
    detectQualityFlags(projectPath),
    getGitSnapshot(projectPath),
  ]);

  if (fileMetrics.sourceFiles === 0) return null;

  const staleDays = toDaysSince(git.lastCommitAt);
  const quality = evaluateProjectQuality({
    staleDays,
    dirtyFiles: git.dirtyFiles,
    openTodos: fileMetrics.todoCount,
    hasReadme: qualityFlags.hasReadme,
    hasTests: qualityFlags.hasTests,
    hasDocker: qualityFlags.hasDocker,
  });

  return {
    id: slugify(dirName),
    name: toDisplayName(dirName),
    path: projectPath,
    stack: stack.length > 0 ? stack : ["Unknown"],
    architecture: inferArchitecture(stack),
    sourceFiles: fileMetrics.sourceFiles,
    dirtyFiles: git.dirtyFiles,
    openTodos: fileMetrics.todoCount,
    hasReadme: qualityFlags.hasReadme,
    hasTests: qualityFlags.hasTests,
    hasDocker: qualityFlags.hasDocker,
    lastCommitAt: git.lastCommitAt,
    lastCommitMessage: git.lastCommitMessage,
    quality,
  };
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  mapper: (item: T) => Promise<R>,
): Promise<R[]> {
  if (items.length === 0) return [];
  const size = Math.max(1, Math.min(concurrency, items.length));
  const results = new Array<R>(items.length);
  let cursor = 0;

  const workers = Array.from({ length: size }, async () => {
    while (true) {
      const index = cursor;
      cursor += 1;
      if (index >= items.length) return;
      results[index] = await mapper(items[index]);
    }
  });

  await Promise.all(workers);
  return results;
}

function buildStats(projects: RepoProject[], scannedAt: string): DashboardStats {
  const averageHealth =
    projects.length === 0
      ? 0
      : Math.round(
          projects.reduce((sum, project) => sum + project.quality.healthScore, 0) / projects.length,
        );

  const staleRepoCount = projects.filter((project) => {
    const days = toDaysSince(project.lastCommitAt);
    return days !== null && days > 14;
  }).length;

  return {
    scannedProjects: projects.length,
    averageHealth,
    criticalCount: projects.filter((project) => project.quality.healthLevel === "critical").length,
    warningCount: projects.filter((project) => project.quality.healthLevel === "warning").length,
    dirtyRepoCount: projects.filter((project) => project.dirtyFiles > 0).length,
    staleRepoCount,
    scannedAt,
  };
}

function buildTimeline(projects: RepoProject[]): TimelineEvent[] {
  return projects
    .filter((project) => project.lastCommitAt && project.lastCommitMessage)
    .map((project) => {
      const staleDays = toDaysSince(project.lastCommitAt);
      return {
        id: `${project.id}-${project.lastCommitAt}`,
        projectId: project.id,
        projectName: project.name,
        commitAt: project.lastCommitAt as string,
        commitMessage: project.lastCommitMessage as string,
        isStale: staleDays !== null && staleDays > 14,
      };
    })
    .sort((a, b) => Date.parse(b.commitAt) - Date.parse(a.commitAt))
    .slice(0, 30);
}

function buildActions(projects: RepoProject[]): ActionItem[] {
  const riskSorted = sortByRiskDesc(projects).slice(0, 8);
  return riskSorted.map((project, index) => ({
    id: `${project.id}-${index}`,
    title: `${project.name} risk reduction`,
    description: project.quality.recommendedAction,
    impact: index < 2 ? "high" : index < 5 ? "medium" : "low",
    projectId: project.id,
    projectName: project.name,
    scoreDeltaEstimate: estimateScoreDelta(project),
  }));
}

function buildPlaybook(actions: ActionItem[]): PlaybookDay[] {
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const topActions = actions.slice(0, 5);

  return weekdays.map((day, idx) => {
    const action = topActions[idx];
    if (!action) {
      return {
        day,
        focus: "Maintenance",
        actions: ["Review completed fixes", "Resolve pending tasks"],
      };
    }

    return {
      day,
      focus: action.projectName,
      actions: [
        action.title,
        `${action.description} (+${action.scoreDeltaEstimate}pt expected)`,
        "Verify with lint/test/build",
      ],
    };
  });
}

async function scanAllProjects(): Promise<RepoProject[]> {
  const directories = await collectDirEntries(SCAN_ROOT);
  const scanned = await mapWithConcurrency(directories, SCAN_CONCURRENCY, async (dirName) =>
    scanProject(path.join(SCAN_ROOT, dirName)),
  );
  return scanned.filter((project): project is RepoProject => project !== null);
}

async function buildPayload(): Promise<ScanPayload> {
  const scannedAt = new Date().toISOString();
  const projects = sortByRiskDesc(await scanAllProjects());
  const actions = buildActions(projects);
  const timeline = buildTimeline(projects);
  const playbook = buildPlaybook(actions);
  const stats = buildStats(projects, scannedAt);

  return {
    stats,
    projects,
    actions,
    timeline,
    playbook,
  };
}

async function refreshPayload(): Promise<ScanPayload> {
  if (inflightRefresh) return inflightRefresh;

  inflightRefresh = (async () => {
    const payload = await buildPayload();
    cache.payload = payload;
    cache.expiresAt = Date.now() + CACHE_TTL_MS;
    await writeDiskCache(payload);
    return payload;
  })().finally(() => {
    inflightRefresh = null;
  });

  return inflightRefresh;
}

function applyMemoryCache(payload: ScanPayload, ageMs = 0): void {
  cache.payload = payload;
  cache.expiresAt = Date.now() + Math.max(1000, CACHE_TTL_MS - ageMs);
}

export async function getScanPayload(force = false): Promise<ScanPayload> {
  if (!force && cache.payload && cache.expiresAt > Date.now()) {
    return cache.payload;
  }

  if (force) {
    return refreshPayload();
  }

  const disk = await readDiskCache();
  if (disk) {
    const ageMs = Date.now() - disk.savedAt;
    applyMemoryCache(disk.payload, ageMs);
    if (ageMs <= CACHE_TTL_MS) {
      return disk.payload;
    }

    void refreshPayload();
    return disk.payload;
  }

  return refreshPayload();
}

export async function getProjects(force = false): Promise<RepoProject[]> {
  const payload = await getScanPayload(force);
  return payload.projects;
}

export async function getProjectById(
  projectId: string,
  force = false,
): Promise<RepoProject | null> {
  const projects = await getProjects(force);
  return projects.find((project) => project.id === projectId) ?? null;
}

export async function getDashboardStats(force = false): Promise<DashboardStats> {
  const payload = await getScanPayload(force);
  return payload.stats;
}

export async function getTimeline(force = false): Promise<TimelineEvent[]> {
  const payload = await getScanPayload(force);
  return payload.timeline;
}

export async function getActions(force = false): Promise<ActionItem[]> {
  const payload = await getScanPayload(force);
  return payload.actions;
}

export async function getPlaybook(force = false): Promise<PlaybookDay[]> {
  const payload = await getScanPayload(force);
  return payload.playbook;
}
