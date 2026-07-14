@echo off
echo ==================================================
echo      Iniciando Sistema de Gestion Academico
echo ==================================================
echo.

echo Iniciando Back-end (Puerto 3001)...
start "SGA Back-end" cmd /k "cd packages\back-end && npm run dev"

echo Iniciando Front-end (Puerto 5173)...
start "SGA Front-end" cmd /k "cd packages\front-end && npm run dev"

echo Iniciando Tunnel de Cloudflare (Puerto 5173)...
start "SGA Cloudflare Tunnel" cmd /k "cloudflared tunnel --url http://localhost:5173"

echo.
echo Los servicios y el tunnel se estan ejecutando en ventanas separadas.
echo Puedes cerrar esta ventana.

