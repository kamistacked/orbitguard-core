@echo off
title OrbitGuard AI Launcher
echo ========================================================
echo        Starting OrbitGuard AI Engine & Cockpit
echo ========================================================

:: 1. Launch FastAPI Backend on port 8000
echo [1/2] Launching Astrodynamics Backend (FastAPI)...
start "OrbitGuard Backend" cmd /k "cd /d C:\Users\Lenovo\IdeaProjects\earth 1.0\orbitguard\backend && call ..\.venv\Scripts\activate.bat && uvicorn main:app --reload --port 8000 --host 0.0.0.0"

:: 2. Launch Vite Frontend on port 5173
echo [2/2] Launching 3D WebGL Frontend (Vite)...
start "OrbitGuard Frontend" cmd /k "cd /d C:\Users\Lenovo\IdeaProjects\earth 1.0\orbitguard\frontend && npm run dev"

:: 3. Wait for initialization, then launch the browser
echo Waiting for servers to bind...
timeout /t 3 >nul
start http://localhost:5173

echo Systems operational. Keep both terminal windows open.
