@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d %~dp0

if not exist node_modules (
  echo [Repo Navigator] node_modules not found. Installing dependencies...
  call cmd /c npm install
  if errorlevel 1 goto :error
)

if not exist .env.local (
  if exist .env.example (
    copy /Y .env.example .env.local >nul
  )
)

set "PORT=3000"

:find_port
netstat -ano | findstr /R /C:":!PORT! .*LISTENING" >nul
if !errorlevel! EQU 0 (
  set /a PORT+=1
  goto :find_port
)

set "APP_URL=http://localhost:!PORT!/"
echo [Repo Navigator] Opening browser: !APP_URL!
start "" "!APP_URL!"

if exist .next (
  echo [Repo Navigator] Cleaning previous build cache...
  rmdir /S /Q .next
)

echo [Repo Navigator] Running fresh production build...
call cmd /c npm run build
if errorlevel 1 goto :error

echo [Repo Navigator] Starting production server on port !PORT!...
if exist node_modules\next\dist\bin\next (
  node node_modules\next\dist\bin\next start -p !PORT!
) else (
  call cmd /c npm run start -- -p !PORT!
)
if errorlevel 1 goto :error
goto :eof

:error
echo.
echo [Repo Navigator] Startup failed.
echo Please check Node.js/npm installation and package-lock consistency.
pause
exit /b 1
