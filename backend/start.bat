@'
@echo off
echo ==============================================
echo       Launching OrbitGuard AI Systems
echo ==============================================

:: 1. Launch FastAPI Backend
echo [1/2] Starting FastAPI Backend on port 8000...
start "OrbitGuard Backend" cmd /k "cd /d C:\Users\Lenovo\IdeaProjects\earth 1.0\orbitguard\backend && call C:\Users\Lenovo\IdeaProjects\earth 1.0\orbitguard\.venv\Scripts\activate.bat && uvicorn main:app --reload --port 8000"

:: 2. Launch Vite Frontend
echo [2/2] Starting Vite Frontend on port 5173...
start "OrbitGuard Frontend" cmd /k "cd /d C:\Users\Lenovo\IdeaProjects\earth 1.0\orbitguard\frontend && npm run dev"

:: 3. Wait and open browser