#!/usr/bin/env python3
"""
Simple Fetch.ai Agent for AgentChat Integration

This is a simplified version that focuses on the HTTP API functionality
without the complex Fetch.ai agent setup.
"""

import asyncio
import json
import logging
from typing import Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(title="Fetch.ai Agent API")

# Enable CORS for web interface
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
    "wallet": "A cryptocurrency wallet is a digital tool for storing, sending, and receiving cryptocurrencies.",
    "nft": "NFTs (Non-Fungible Tokens) are unique digital assets that represent ownership of specific items.",
    "smart_contract": "Smart contracts are self-executing contracts with terms directly written into code."
}

def process_message(message: str) -> str:
    """Process incoming message and generate appropriate response"""
    message_lower = message.lower()
    
    # Simple keyword-based responses
    if any(keyword in message_lower for keyword in ["blockchain", "crypto", "bitcoin"]):
        return f"Blockchain technology is revolutionizing how we handle digital transactions. {KNOWLEDGE_BASE['blockchain']} Would you like to know more about specific blockchain applications?"
    
    elif any(keyword in message_lower for keyword in ["defi", "yield", "farming", "liquidity"]):
        return f"DeFi is an exciting development in finance! {KNOWLEDGE_BASE['defi']} I can help you understand DeFi protocols, yield farming, and liquidity providing strategies."
    
    elif any(keyword in message_lower for keyword in ["trade", "trading", "market", "price"]):
        return f"Trading requires careful analysis and risk management. {KNOWLEDGE_BASE['trading']} I can provide insights on market analysis and trading strategies."
    
    elif any(keyword in message_lower for keyword in ["wallet", "address", "send", "receive"]):
        return f"Wallets are essential for managing cryptocurrencies. {KNOWLEDGE_BASE['wallet']} I can help you understand wallet types and security best practices."
    
    elif any(keyword in message_lower for keyword in ["nft", "non-fungible", "collection"]):
        return f"NFTs are transforming digital ownership! {KNOWLEDGE_BASE['nft']} I can help you understand NFT collections, marketplaces, and investment strategies."
    
    elif any(keyword in message_lower for keyword in ["smart contract", "contract", "dapp"]):
        return f"Smart contracts power the decentralized web! {KNOWLEDGE_BASE['smart_contract']} I can explain how they work and their applications in DeFi."
    
    elif any(keyword in message_lower for keyword in ["hello", "hi", "greetings"]):
        return "Hello! I'm your Fetch.ai autonomous agent, specialized in blockchain and Web3 technologies. How can I assist you today?"
    
    elif any(keyword in message_lower for keyword in ["portfolio", "analytics", "balance"]):
        return "I can help you analyze your portfolio! I understand token balances, NFT collections, DeFi positions, and transaction history. What specific aspect would you like to explore?"
    
    else:
        return "I'm here to help with blockchain, DeFi, trading, NFTs, and Web3 questions. Could you be more specific about what you'd like to know? I can assist with portfolio analysis, trading strategies, DeFi protocols, and more!"

@app.get("/api/status")
async def get_status():
    """Get agent status"""
    return {
        "status": "online",
        "agent_id": "fetch-ai-agent-demo",
        "capabilities": AGENT_CAPABILITIES,
        "message": "Agent is ready for blockchain assistance"
    }

@app.post("/api/chat")
async def chat_endpoint(request: dict):
    """HTTP endpoint for chat messages"""
    try:
        message = request.get("message", "")
        user_id = request.get("user_id", "anonymous")
        
        if not message:
            raise HTTPException(status_code=400, detail="Message is required")
        
        logger.info(f"Received message from {user_id}: {message}")
        
        # Process message
        response_content = process_message(message)
        
        return {
            "response": response_content,
            "agent_id": "fetch-ai-agent-demo",
            "timestamp": "2024-01-01T00:00:00Z"
        }
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/capabilities")
async def get_capabilities():
    """Get agent capabilities"""
    return {
        "capabilities": AGENT_CAPABILITIES,
        "agent_id": "fetch-ai-agent-demo"
    }

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Fetch.ai Agent API is running",
        "version": "1.0.0",
        "endpoints": {
            "status": "/api/status",
            "chat": "/api/chat",
            "capabilities": "/api/capabilities"
        }
    }

if __name__ == "__main__":
    print("Starting Fetch.ai Agent API...")
    print("Agent capabilities:", ", ".join(AGENT_CAPABILITIES))
    print("API will be available at: http://127.0.0.1:8001")
    print("Test endpoint: http://127.0.0.1:8001/api/status")
    
    uvicorn.run(app, host="127.0.0.1", port=8001, log_level="info")
