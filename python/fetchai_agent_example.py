#!/usr/bin/env python3
"""
Fetch.ai Agent Example for AgentChat Integration

This script demonstrates how to create a Fetch.ai agent that can communicate
with the blockchain chatbot interface.

Requirements:
- Python 3.8+
- pip install uagents
"""

import asyncio
import json
import logging
from typing import Dict, Any
from uagents import Agent, Context, Model
from uagents.network import wait_for_tx_to_complete
from uagents.setup import fund_agent_if_low

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Message models for communication
class ChatMessage(Model):
    """Message model for chat communication"""
    type: str
    content: str
    timestamp: str
    user_id: str

class ChatResponse(Model):
    """Response model for chat responses"""
    type: str
    content: str
    timestamp: str
    agent_id: str

class AgentStatus(Model):
    """Model for agent status updates"""
    status: str
    message: str

# Create the agent
agent = Agent(
    name="blockchain_chatbot_agent",
    seed="demo_seed_phrase_for_local_development_only",  # Demo seed for local development
    endpoint="127.0.0.1:8001",  # Adjust port as needed
    port=8001
)

# Agent capabilities
AGENT_CAPABILITIES = [
    "customer_service",
    "blockchain_support", 
    "defi_advice",
    "trading_analysis",
    "general_questions"
]

# Simple knowledge base for responses
KNOWLEDGE_BASE = {
    "blockchain": "Blockchain is a distributed ledger technology that maintains a continuously growing list of records.",
    "defi": "DeFi (Decentralized Finance) refers to financial services built on blockchain networks.",
    "trading": "Trading involves buying and selling assets in financial markets to generate profit.",
    "wallet": "A cryptocurrency wallet is a digital tool for storing, sending, and receiving cryptocurrencies."
}

@agent.on_message(model=ChatMessage)
async def handle_chat_message(ctx: Context, msg: ChatMessage):
    """Handle incoming chat messages"""
    logger.info(f"Received message from {msg.user_id}: {msg.content}")
    
    try:
        # Process the message and generate response
        response_content = await process_message(msg.content)
        
        # Create response
        response = ChatResponse(
            type="response",
            content=response_content,
            timestamp=ctx.message.timestamp,
            agent_id=agent.address
        )
        
        # Send response back
        await ctx.send(ctx.message.sender, response)
        logger.info(f"Sent response: {response_content}")
        
    except Exception as e:
        logger.error(f"Error processing message: {e}")
        error_response = ChatResponse(
            type="response",
            content="I'm sorry, I encountered an error processing your message. Please try again.",
            timestamp=ctx.message.timestamp,
            agent_id=agent.address
        )
        await ctx.send(ctx.message.sender, error_response)

async def process_message(message: str) -> str:
    """Process incoming message and generate appropriate response"""
    message_lower = message.lower()
    
    # Simple keyword-based responses (replace with actual LLM integration)
    if any(keyword in message_lower for keyword in ["blockchain", "crypto", "bitcoin"]):
        return f"Blockchain technology is revolutionizing how we handle digital transactions. {KNOWLEDGE_BASE['blockchain']} Would you like to know more about specific blockchain applications?"
    
    elif any(keyword in message_lower for keyword in ["defi", "yield", "farming", "liquidity"]):
        return f"DeFi is an exciting development in finance! {KNOWLEDGE_BASE['defi']} I can help you understand DeFi protocols, yield farming, and liquidity providing strategies."
    
    elif any(keyword in message_lower for keyword in ["trade", "trading", "market", "price"]):
        return f"Trading requires careful analysis and risk management. {KNOWLEDGE_BASE['trading']} I can provide insights on market analysis and trading strategies."
    
    elif any(keyword in message_lower for keyword in ["wallet", "address", "send", "receive"]):
        return f"Wallets are essential for managing cryptocurrencies. {KNOWLEDGE_BASE['wallet']} I can help you understand wallet types and security best practices."
    
    elif any(keyword in message_lower for keyword in ["hello", "hi", "greetings"]):
        return "Hello! I'm your Fetch.ai autonomous agent, specialized in blockchain and Web3 technologies. How can I assist you today?"
    
    else:
        return "I'm here to help with blockchain, DeFi, trading, and Web3 questions. Could you be more specific about what you'd like to know?"

@agent.on_event("startup")
async def startup_event(ctx: Context):
    """Handle agent startup"""
    logger.info("Fetch.ai Agent started successfully!")
    logger.info(f"Agent address: {agent.address}")
    logger.info(f"Agent capabilities: {', '.join(AGENT_CAPABILITIES)}")
    
    # Update status
    status = AgentStatus(
        status="online",
        message="Agent is ready to handle chat messages"
    )
    ctx.storage.set("status", status.dict())

# HTTP API endpoints for web interface integration
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="Fetch.ai Agent API")

# Enable CORS for web interface
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/status")
async def get_status():
    """Get agent status"""
    return {
        "status": "online",
        "agent_id": agent.address,
        "capabilities": AGENT_CAPABILITIES,
        "message": "Agent is ready"
    }

@app.post("/api/chat")
async def chat_endpoint(request: dict):
    """HTTP endpoint for chat messages"""
    try:
        message = request.get("message", "")
        user_id = request.get("user_id", "anonymous")
        
        if not message:
            raise HTTPException(status_code=400, detail="Message is required")
        
        # Process message
        response_content = await process_message(message)
        
        return {
            "response": response_content,
            "agent_id": agent.address,
            "timestamp": ctx.message.timestamp if 'ctx' in locals() else None
        }
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/capabilities")
async def get_capabilities():
    """Get agent capabilities"""
    return {
        "capabilities": AGENT_CAPABILITIES,
        "agent_id": agent.address
    }

def run_agent_and_api():
    """Run both the agent and the HTTP API"""
    import threading
    
    # Start the agent in a separate thread
    agent_thread = threading.Thread(target=lambda: agent.run())
    agent_thread.daemon = True
    agent_thread.start()
    
    # Start the HTTP API server in the main thread
    uvicorn.run(app, host="127.0.0.1", port=8001, log_level="info")

if __name__ == "__main__":
    print("Starting Fetch.ai Agent for AgentChat...")
    print("Make sure to:")
    print("1. Replace 'your_secret_seed_phrase_here' with your actual seed phrase")
    print("2. Install required packages: pip install uagents fastapi uvicorn")
    print("3. Ensure your agent has sufficient FET tokens for operation")
    
    # Note: For local development, we don't need to fund the agent
    print("Running in local development mode - no FET tokens required")
    
    # Run the agent and API
    run_agent_and_api()
