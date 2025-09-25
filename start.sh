#!/bin/bash

echo "🚀 Starting EthGlobal dApp..."
echo

echo "📦 Installing dependencies..."
pnpm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo
echo "🗄️ Setting up database..."
cd backend
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed
cd ..

echo
echo "🎉 Setup complete! Starting development servers..."
echo
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:3001"
echo "Agents: ports 8001-8003"
echo

# Start services in background
cd frontend && pnpm dev &
cd ../backend && pnpm dev &
cd ../agents && python run_agents.py &

echo "✅ All services started!"
echo "Press Ctrl+C to stop all services"

# Wait for interrupt
trap 'echo "🛑 Stopping services..."; kill $(jobs -p); exit' INT
wait
