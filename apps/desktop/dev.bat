@echo off
echo --- Limpiando procesos de cuoiocane-desktop ---

:: 1. Matamos el proceso con el nombre EXACTO del TOML
taskkill /IM "cuoiocane-desktop.exe" /F >nul 2>&1

:: 2. Por seguridad, matamos Node.js (a veces el servidor frontend bloquea cosas)
taskkill /IM "node.exe" /F >nul 2>&1

:: Pausa técnica para que el sistema de archivos respire
timeout /t 1 /nobreak >nul

echo --- Iniciando la aplicacion ---
:: Ejecutamos mediante NPM
npm run tauri dev