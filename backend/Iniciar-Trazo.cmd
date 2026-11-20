@echo off
setlocal
cd /d "%~dp0"
call npm.cmd run pm2:start
if errorlevel 1 (
  pause
  exit /b 1
)
start "" "http://127.0.0.1:5173"
