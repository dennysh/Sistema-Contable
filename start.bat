@echo off
echo Iniciando Sistema Contable...
echo.

echo Iniciando Backend (Flask)...
start "Backend" cmd /k "cd /d %~dp0 && python backend/app.py"

echo Esperando 3 segundos...
timeout /t 3 /nobreak > nul

echo Iniciando Frontend (React)...
start "Frontend" cmd /k "cd /d %~dp0 && npm start"

echo.
echo Sistema iniciado!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause
