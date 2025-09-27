#!/usr/bin/env python3
"""
Minimal Fetch.ai Agent for Testing
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="Minimal Fetch.ai Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/status")
async def get_status():
    return {
        "status": "online",
        "agent_id": "minimal-agent",
        "capabilities": ["blockchain_support", "general_questions"],
        "message": "Minimal agent is running"
    }

@app.post("/api/chat")
async def chat(request: dict):
    message = request.get("message", "")
    return {
        "response": f"I received your message: '{message}'. I'm a minimal Fetch.ai agent ready to help with blockchain questions!",
        "agent_id": "minimal-agent"
    }

@app.get("/")
async def root():
    return {"message": "Minimal Fetch.ai Agent is running", "status": "online"}

if __name__ == "__main__":
    print("Starting Minimal Fetch.ai Agent...")
    print("Server will be available at: http://127.0.0.1:8001")
    uvicorn.run(app, host="0.0.0.0", port=8001, log_level="info")
