export type ScanMetadata = {
  scanRoot: string;
  scanLimit: number;
  cacheTtlSeconds: number;
};

export const defaultScanMetadata: ScanMetadata = {
  scanRoot: process.env.REPO_NAVIGATOR_SCAN_ROOT ?? "C:\\Users\\wwwhi\\Create",
  scanLimit: 40,
  cacheTtlSeconds: 60,
};
