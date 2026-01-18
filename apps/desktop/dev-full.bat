@echo off
echo --- Stopping previous processes ---
taskkill /IM "cuoiocane-desktop.exe" /F >nul 2>&1
taskkill /IM "node.exe" /F >nul 2>&1

timeout /t 1 /nobreak >nul

echo --- Starting API (Backend) ---
start "Cuoio API" /D "..\api" npm run start:dev

echo --- Waiting for API to initialize... ---
timeout /t 5 /nobreak >nul

echo --- Starting Desktop App (incl. Frontend) ---
npm run tauri dev
