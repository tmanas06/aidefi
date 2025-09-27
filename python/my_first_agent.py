#!/usr/bin/env python3
"""
My First Fetch.ai Agent

This is a comprehensive example showing how to create a Fetch.ai agent
with proper configuration, startup behavior, and message handling.
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

# Agent Configuration
# name: Identifies the agent (here, "alice")
# seed: Sets a deterministic seed, generating fixed addresses each time
# port and endpoint: Configure where the agent will be available
agent = Agent(
    name="alice",  # Agent identifier
    seed="my_first_agent_seed_phrase_12345",  # Deterministic seed for fixed addresses
    endpoint="127.0.0.1:8002",  # Agent endpoint
    port=8002  # Port where agent will be available
)

# Agent capabilities
AGENT_CAPABILITIES = [
    "blockchain_education",
    "defi_guidance", 
    "portfolio_analysis",
    "trading_insights",
    "nft_knowledge",
    "smart_contract_explanation"
]

# Enhanced knowledge base
KNOWLEDGE_BASE = {
    "blockchain": {
        "definition": "Blockchain is a distributed ledger technology that maintains a continuously growing list of records.",
        "features": ["Decentralization", "Transparency", "Immutability", "Security"],
        "use_cases": ["Cryptocurrency", "Smart Contracts", "Supply Chain", "Voting Systems"]
    },
    "defi": {
        "definition": "DeFi (Decentralized Finance) refers to financial services built on blockchain networks.",
        "protocols": ["Uniswap", "Aave", "Compound", "MakerDAO"],
        "benefits": ["No intermediaries", "24/7 access", "Transparent", "Programmable"]
    },
    "trading": {
        "definition": "Trading involves buying and selling assets in financial markets to generate profit.",
        "strategies": ["DCA", "HODL", "Swing Trading", "Arbitrage"],
        "risks": ["Market volatility", "Liquidity risk", "Smart contract risk"]
    },
    "nft": {
        "definition": "NFTs (Non-Fungible Tokens) are unique digital assets that represent ownership of specific items.",
        "standards": ["ERC-721", "ERC-1155"],
        "use_cases": ["Digital Art", "Gaming", "Real Estate", "Identity"]
    },
    "smart_contract": {
        "definition": "Smart contracts are self-executing contracts with terms directly written into code.",
        "languages": ["Solidity", "Vyper", "Rust"],
        "platforms": ["Ethereum", "Polygon", "BSC", "Avalanche"]
    }
}

# Behavior on startup
@agent.on_event("startup")
async def startup_event(ctx: Context):
    """Function that runs as soon as the agent launches"""
    # Log agent information
    logger.info(f"🚀 Agent '{agent.name}' is starting up!")
    logger.info(f"📍 Agent address: {agent.address}")
    logger.info(f"🔗 Agent port: 8002")
    logger.info(f"⚡ Agent capabilities: {', '.join(AGENT_CAPABILITIES)}")
    
    # Update agent status
    status = AgentStatus(
        status="online",
        message=f"Agent {agent.name} is ready to help with blockchain questions!"
    )
    ctx.storage.set("status", status.dict())
    
    # Log startup completion
    logger.info(f"✅ Agent '{agent.name}' startup completed successfully!")

@agent.on_message(model=ChatMessage)
async def handle_chat_message(ctx: Context, msg: ChatMessage):
    """Handle incoming chat messages"""
    logger.info(f"📨 Received message from {msg.user_id}: {msg.content}")
    
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
        logger.info(f"📤 Sent response: {response_content[:100]}...")
        
    except Exception as e:
        logger.error(f"❌ Error processing message: {e}")
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
    
    # Enhanced keyword-based responses with detailed information
    if any(keyword in message_lower for keyword in ["blockchain", "crypto", "bitcoin"]):
        kb = KNOWLEDGE_BASE["blockchain"]
        return f"""🔗 **Blockchain Technology**
        
{kb["definition"]}

**Key Features:**
{chr(10).join([f"• {feature}" for feature in kb["features"]])}

**Common Use Cases:**
{chr(10).join([f"• {use_case}" for use_case in kb["use_cases"]])}

Would you like me to explain any specific aspect of blockchain technology?"""
    
    elif any(keyword in message_lower for keyword in ["defi", "yield", "farming", "liquidity"]):
        kb = KNOWLEDGE_BASE["defi"]
        return f"""🏦 **DeFi (Decentralized Finance)**
        
{kb["definition"]}

**Popular Protocols:**
{chr(10).join([f"• {protocol}" for protocol in kb["protocols"]])}

**Key Benefits:**
{chr(10).join([f"• {benefit}" for benefit in kb["benefits"]])}

I can help you understand specific DeFi protocols or strategies. What would you like to know?"""
    
    elif any(keyword in message_lower for keyword in ["trade", "trading", "market", "price"]):
        kb = KNOWLEDGE_BASE["trading"]
        return f"""📈 **Trading & Markets**
        
{kb["definition"]}

**Common Strategies:**
{chr(10).join([f"• {strategy}" for strategy in kb["strategies"]])}

**Important Risks:**
{chr(10).join([f"• {risk}" for risk in kb["risks"]])}

Remember: Always do your own research and never invest more than you can afford to lose!"""
    
    elif any(keyword in message_lower for keyword in ["nft", "non-fungible", "collection"]):
        kb = KNOWLEDGE_BASE["nft"]
        return f"""🎨 **NFTs (Non-Fungible Tokens)**
        
{kb["definition"]}

**Technical Standards:**
{chr(10).join([f"• {standard}" for standard in kb["standards"]])}

**Use Cases:**
{chr(10).join([f"• {use_case}" for use_case in kb["use_cases"]])}

NFTs are revolutionizing digital ownership. What aspect interests you most?"""
    
    elif any(keyword in message_lower for keyword in ["smart contract", "contract", "dapp"]):
        kb = KNOWLEDGE_BASE["smart_contract"]
        return f"""⚡ **Smart Contracts**
        
{kb["definition"]}

**Programming Languages:**
{chr(10).join([f"• {language}" for language in kb["languages"]])}

**Popular Platforms:**
{chr(10).join([f"• {platform}" for platform in kb["platforms"]])}

Smart contracts are the foundation of Web3 applications. Would you like to learn about specific use cases?"""
    
    elif any(keyword in message_lower for keyword in ["hello", "hi", "greetings"]):
        return f"""👋 **Hello! I'm {agent.name}, your blockchain assistant!**

I'm here to help you understand:
• Blockchain technology and cryptocurrencies
• DeFi protocols and yield farming
• NFT collections and marketplaces
• Smart contracts and dApps
• Trading strategies and market analysis
• Portfolio management

What would you like to explore today? Just ask me about any blockchain topic!"""
    
    elif any(keyword in message_lower for keyword in ["portfolio", "analytics", "balance"]):
        return """📊 **Portfolio Analysis**

I can help you understand:
• Token balance analysis and valuation
• NFT collection overview and floor prices
• DeFi position tracking and APY calculations
• Transaction history and gas optimization
• Risk assessment and diversification

Connect your wallet to the analytics dashboard to get started with comprehensive portfolio insights!"""
    
    elif any(keyword in message_lower for keyword in ["help", "what can you do"]):
        return f"""🤖 **I'm {agent.name}, your AI blockchain assistant!**

**My Capabilities:**
{chr(10).join([f"• {capability.replace('_', ' ').title()}" for capability in AGENT_CAPABILITIES])}

**I can help you with:**
• Explaining complex blockchain concepts
• Analyzing DeFi protocols and strategies
• Understanding NFT markets and collections
• Smart contract development guidance
• Trading insights and risk management
• Portfolio optimization techniques

Just ask me anything about Web3, DeFi, NFTs, or blockchain technology!"""
    
    else:
        return """🤔 **I'm not sure I understand that question.**

I specialize in blockchain and Web3 topics. Here are some things you can ask me about:

• "What is blockchain?"
• "How does DeFi work?"
• "Explain smart contracts"
• "What are NFTs?"
• "Trading strategies for crypto"
• "Portfolio analysis help"

Feel free to ask me anything about cryptocurrencies, DeFi, NFTs, or blockchain technology!"""

# HTTP API for web interface integration
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="My First Fetch.ai Agent API")

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
        "agent_name": agent.name,
        "capabilities": AGENT_CAPABILITIES,
        "port": 8002,
        "message": f"Agent {agent.name} is ready for blockchain assistance"
    }

@app.post("/api/chat")
async def chat_endpoint(request: dict):
    """HTTP endpoint for chat messages"""
    try:
        message = request.get("message", "")
        user_id = request.get("user_id", "anonymous")
        
        if not message:
            raise HTTPException(status_code=400, detail="Message is required")
        
        logger.info(f"📨 HTTP: Received message from {user_id}: {message}")
        
        # Process message
        response_content = await process_message(message)
        
        return {
            "response": response_content,
            "agent_id": agent.address,
            "agent_name": agent.name,
            "timestamp": "2024-01-01T00:00:00Z"
        }
        
    except Exception as e:
        logger.error(f"❌ HTTP Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/capabilities")
async def get_capabilities():
    """Get agent capabilities"""
    return {
        "capabilities": AGENT_CAPABILITIES,
        "agent_id": agent.address,
        "agent_name": agent.name,
        "knowledge_base": list(KNOWLEDGE_BASE.keys())
    }

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": f"Agent {agent.name} API is running",
        "version": "1.0.0",
        "agent_address": agent.address,
        "endpoints": {
            "status": "/api/status",
            "chat": "/api/chat",
            "capabilities": "/api/capabilities"
        }
    }

def run_agent_and_api():
    """Run both the agent and the HTTP API"""
    import threading
    
    # Start the agent in a separate thread
    agent_thread = threading.Thread(target=lambda: agent.run())
    agent_thread.daemon = True
    agent_thread.start()
    
    # Start the HTTP API server in the main thread
    uvicorn.run(app, host="127.0.0.1", port=8002, log_level="info")

if __name__ == "__main__":
    print("🚀 Starting My First Fetch.ai Agent...")
    print(f"📍 Agent Name: {agent.name}")
    print(f"🔗 Agent Address: {agent.address}")
    print(f"⚡ Agent Port: 8002")
    print(f"🎯 Capabilities: {', '.join(AGENT_CAPABILITIES)}")
    print(f"🌐 API will be available at: http://127.0.0.1:8002")
    print(f"📊 Status endpoint: http://127.0.0.1:8002/api/status")
    
    # Note: For local development, we don't need to fund the agent
    print("💡 Running in local development mode - no FET tokens required")
    
    # Run the agent and API
    run_agent_and_api()