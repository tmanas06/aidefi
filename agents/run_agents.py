#!/usr/bin/env python3
"""
Agent Runner for EthGlobal dApp
Starts all agents concurrently
"""

import asyncio
import subprocess
import sys
import os
from pathlib import Path

# Add current directory to Python path
sys.path.append(str(Path(__file__).parent))

def run_agent(script_name: str, port: int):
    """Run a single agent in a subprocess"""
    try:
        print(f"Starting {script_name} on port {port}...")
        process = subprocess.Popen([
            sys.executable, script_name
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        return process
    except Exception as e:
        print(f"Error starting {script_name}: {e}")
        return None

async def main():
    """Main function to run all agents"""
    print("🚀 Starting EthGlobal dApp Agents...")
    print("=" * 50)
    
    # Agent configurations
    agents = [
        ("wallet_agent.py", 8001, "Wallet Agent"),
        ("payment_agent.py", 8002, "Payment Agent"),
        ("identity_agent.py", 8003, "Identity Agent")
    ]
    
    processes = []
    
    # Start all agents
    for script, port, name in agents:
        process = run_agent(script, port)
        if process:
            processes.append((process, name, port))
            print(f"✅ {name} started on port {port}")
        else:
            print(f"❌ Failed to start {name}")
    
    if not processes:
        print("❌ No agents started successfully")
        return
    
    print(f"\n🎉 {len(processes)} agents started successfully!")
    print("Press Ctrl+C to stop all agents")
    print("=" * 50)
    
    try:
        # Keep running until interrupted
        while True:
            await asyncio.sleep(1)
            
            # Check if any process has died
            for process, name, port in processes:
                if process.poll() is not None:
                    print(f"⚠️  {name} on port {port} has stopped")
                    # Restart the agent
                    new_process = run_agent(f"{name.lower().replace(' ', '_')}.py", port)
                    if new_process:
                        processes[processes.index((process, name, port))] = (new_process, name, port)
                        print(f"🔄 Restarted {name} on port {port}")
                    
    except KeyboardInterrupt:
        print("\n🛑 Stopping all agents...")
        
        # Terminate all processes
        for process, name, port in processes:
            try:
                process.terminate()
                process.wait(timeout=5)
                print(f"✅ {name} stopped")
            except subprocess.TimeoutExpired:
                process.kill()
                print(f"🔪 {name} force killed")
            except Exception as e:
                print(f"❌ Error stopping {name}: {e}")
        
        print("👋 All agents stopped")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n👋 Goodbye!")
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)
