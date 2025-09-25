@echo off
echo 🚀 Starting EthGlobal dApp...
echo.

echo 📦 Installing dependencies...
call pnpm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo 🗄️ Setting up database...
cd backend
call pnpm prisma:generate
call pnpm prisma:migrate
call pnpm prisma:seed
cd ..

echo.
echo 🎉 Setup complete! Starting development servers...
echo.
echo Frontend: http://localhost:3000
echo Backend: http://localhost:3001
echo Agents: ports 8001-8003
echo.

start "Frontend" cmd /k "cd frontend && pnpm dev"
start "Backend" cmd /k "cd backend && pnpm dev"
start "Agents" cmd /k "cd agents && python run_agents.py"

echo ✅ All services started!
echo Press any key to exit...
pause >nul
