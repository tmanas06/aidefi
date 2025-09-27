import os
import threading
from datetime import datetime
from uuid import uuid4
from fastapi import FastAPI, HTTPException
from web3 import Web3
from dotenv import load_dotenv
import uvicorn
from uagents import Agent, Context, Protocol
from typing import Dict, Any, List
import json

# Import Agent Chat Protocol components
from uagents_core.contrib.protocols.chat import (
    ChatMessage,
    ChatAcknowledgement,
    TextContent,
    ResourceContent,
    Resource,
    MetadataContent,
    StartSessionContent,
    EndSessionContent,
    chat_protocol_spec
)

load_dotenv()

# Create uagents merchant agent using private key
MERCHANT_PRIVATE_KEY = os.getenv("MERCHANT_PRIVATE_KEY")
merchant_agent = Agent(
    name="merchant",
    seed=MERCHANT_PRIVATE_KEY,
    port=8003,
    endpoint=["http://localhost:8003/submit"],
    publish_agent_details=True
)

# Initialize the chat protocol
chat_proto = Protocol(spec=chat_protocol_spec)

# startup handler
@merchant_agent.on_event("startup")
async def startup_function(ctx: Context):
    ctx.logger.info(f"Hello, I'm merchant agent {merchant_agent.name} and my address is {merchant_agent.address}.")
    ctx.logger.info("Merchant agent is ready to handle chat protocol messages and e-commerce operations.")

# Chat Protocol Message Handler
@chat_proto.on_message(ChatMessage)
async def handle_chat_message(ctx: Context, sender: str, msg: ChatMessage):
    """Handle incoming chat messages using the standardized chat protocol"""
    ctx.logger.info(f"Received chat message from {sender} with msg_id: {msg.msg_id}")
    
    # Process each content item in the message
    for item in msg.content:
        if isinstance(item, TextContent):
            ctx.logger.info(f"Text content from {sender}: {item.text}")
            
            # Send acknowledgment
            ack = ChatAcknowledgement(
                timestamp=datetime.utcnow(),
                acknowledged_msg_id=msg.msg_id
            )
            await ctx.send(sender, ack)
            
            # Process the message and generate response
            response_text = await process_merchant_message(item.text)
            
            # Send response message
            response = ChatMessage(
                timestamp=datetime.utcnow(),
                msg_id=uuid4(),
                content=[TextContent(type="text", text=response_text)]
            )
            await ctx.send(sender, response)
            
        elif isinstance(item, ResourceContent):
            ctx.logger.info(f"Resource content from {sender}: {item.resource_id}")
            # Handle resource content if needed
            
        elif isinstance(item, MetadataContent):
            ctx.logger.info(f"Metadata content from {sender}: {item.metadata}")
            # Handle metadata content if needed

# Chat Protocol Acknowledgement Handler
@chat_proto.on_message(ChatAcknowledgement)
async def handle_acknowledgement(ctx: Context, sender: str, msg: ChatAcknowledgement):
    """Handle chat acknowledgements"""
    ctx.logger.info(f"Received acknowledgement from {sender} for message: {msg.acknowledged_msg_id}")

async def process_merchant_message(message: str) -> str:
    """Process incoming chat messages and generate merchant-specific responses"""
    message_lower = message.lower()
    
    # Handle different types of merchant inquiries
    if any(keyword in message_lower for keyword in ["hello", "hi", "greetings"]):
        return """🛍️ **Welcome to the Merchant Agent!**

I'm your blockchain e-commerce assistant. I can help you with:

• **Browse Products**: View our available inventory
• **Make Purchases**: Buy items with rUSDT tokens
• **Payment Status**: Check transaction verification
• **Product Info**: Get details about specific items

What would you like to do today?"""

    elif any(keyword in message_lower for keyword in ["products", "inventory", "catalog", "goods"]):
        return """📦 **Available Products:**

**Token-Priced Items:**
• Crypto Hoodie - 5 rUSDT
• NFT Poster - 3 rUSDT

**USD-Priced Items:**
• AI Sticker Pack - $1.25
• Fetch.ai Merch Pack - $10.00
• Game Console - $10.00
• Smartphone - $50.00
• Laptop - $100.00
• Tablet - $80.00
• Smartwatch - $30.00
• Smart Home Device - $97.00

To purchase an item, let me know the item ID or name!"""

    elif any(keyword in message_lower for keyword in ["buy", "purchase", "order"]):
        return """💳 **Ready to Make a Purchase!**

To buy an item, please specify:
• **Item ID** (1-10) or **Item Name**
• I'll provide payment details
• You can pay with rUSDT tokens on Rootstock

Which item would you like to purchase?"""

    elif any(keyword in message_lower for keyword in ["payment", "transaction", "verify"]):
        return """🔍 **Payment Verification**

I can help you verify payments by:
• Checking transaction status on blockchain
• Confirming payment receipt
• Providing transaction details

To verify a payment, please provide the transaction hash."""

    elif any(keyword in message_lower for keyword in ["help", "support"]):
        return """❓ **Merchant Agent Help**

I'm a blockchain-enabled merchant agent that can:

**🛒 E-commerce Operations:**
• List available products
• Process purchases with crypto payments
• Verify blockchain transactions
• Handle payment confirmations

**💬 Chat Protocol Features:**
• Structured message handling
• Message acknowledgements
• Session management
• Resource sharing

**🔗 Blockchain Integration:**
• rUSDT token payments
• Rootstock network support
• Transaction verification
• Smart contract interaction

How can I assist you today?"""

    else:
        return """🤔 **I'm not sure I understand that request.**

I specialize in blockchain e-commerce operations. You can ask me about:

• "Show me products" - Browse inventory
• "Buy item 1" - Purchase specific items
• "Payment verification" - Check transactions
• "Help" - Get assistance

What would you like to do?"""

app = FastAPI(title="Merchant Agent")

RPC_URL = os.getenv("RPC_URL")
MERCHANT_ADDRESS = os.getenv("MERCHANT_ADDRESS")
RUSDT_CONTRACT = os.getenv("RUSDT_CONTRACT")

w3 = Web3(Web3.HTTPProvider(RPC_URL))

ERC20_ABI = [
    {
        "anonymous": False,
        "inputs": [
            {"indexed": True, "name": "from", "type": "address"},
            {"indexed": True, "name": "to", "type": "address"},
            {"indexed": False, "name": "value", "type": "uint256"},
        ],
        "name": "Transfer",
        "type": "event",
    }
]

token = w3.eth.contract(address=RUSDT_CONTRACT, abi=ERC20_ABI)


def verify_payment(tx_hash: str, expected_to: str, expected_amount: int) -> bool:
    try:
        receipt = w3.eth.get_transaction_receipt(tx_hash)
        logs = token.events.Transfer().process_receipt(receipt)
        for log in logs:
            if (
                log["args"]["to"].lower() == expected_to.lower()
                and log["args"]["value"] == expected_amount
            ):
                return True
        return False
    except Exception as e:
        print(f"❌ Verification error: {e}")
        return False


@app.get("/goods")
def list_goods():
    return {
        "items": [
            {"id": 1, "name": "Crypto Hoodie", "price_tokens": 5},
            {"id": 2, "name": "NFT Poster", "price_tokens": 3},
            {"id": "g3", "name": "AI Sticker Pack", "price_usd": 1.25},
            {"id": "g4", "name": "Fetch.ai Merch Pack", "price_usd": 10.00},
            {"id": "g5", "name": "Game console", "price_usd": 10.00},
            {"id": "g6", "name": "Smartphone", "price_usd": 50.00},
            {"id": "g7", "name": "Laptop", "price_usd": 100.00},
            {"id": "g8", "name": "Tablet", "price_usd": 80.00},
            {"id": "g9", "name": "Smartwatch", "price_usd": 30.00},
            {"id": "g10", "name": "Smart home device", "price_usd": 97.00},
        ]
    }


@app.post("/purchase")
def purchase(request: dict):
    item_id = request.get("item_id")
    if not item_id:
        raise HTTPException(status_code=400, detail="Item ID required")

    if item_id == 1:
        amount = 5
    elif item_id == 2:
        amount = 3
    else:
        raise HTTPException(status_code=404, detail="Item not found")

    return {
        "status": "402 Payment Required",
        "token_address": RUSDT_CONTRACT,
        "recipient_address": MERCHANT_ADDRESS,
        "amount": amount * 10**18,
        "currency": "rUSDT",
        "chain": "rootstock_testnet",
    }


@app.post("/retry_purchase")
def retry_purchase(request: dict):
    tx_hash = request.get("tx_hash")
    amount = request.get("amount")
    if not tx_hash or not amount:
        raise HTTPException(status_code=400, detail="tx_hash and amount required")

    if verify_payment(tx_hash, MERCHANT_ADDRESS, int(amount)):
        return {"status": "success", "message": "Payment verified ✅. Here are your goods!"}
    else:
        return {"status": "failed", "message": "Payment not found or incorrect ❌"}


# Chat Protocol HTTP Endpoints
@app.post("/api/chat")
async def chat_endpoint(request: dict):
    """HTTP endpoint for chat messages using chat protocol format"""
    try:
        message = request.get("message", "")
        user_id = request.get("user_id", "anonymous")
        
        if not message:
            raise HTTPException(status_code=400, detail="Message is required")
        
        print(f"📨 HTTP: Received message from {user_id}: {message}")
        
        # Process message using the same logic as chat protocol
        response_content = await process_merchant_message(message)
        
        print(f"📤 HTTP: Sending response: {response_content[:100]}...")
        
        return {
            "response": response_content,
            "agent_id": merchant_agent.address,
            "agent_name": merchant_agent.name,
            "timestamp": datetime.utcnow().isoformat(),
            "protocol": "chat_protocol_v1"
        }
        
    except Exception as e:
        print(f"❌ HTTP Error: {e}")
        print(f"❌ Request data: {request}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat-protocol")
async def chat_protocol_endpoint(request: dict):
    """HTTP endpoint that simulates chat protocol message format"""
    try:
        message = request.get("message", "")
        user_id = request.get("user_id", "anonymous")
        
        if not message:
            raise HTTPException(status_code=400, detail="Message is required")
        
        print(f"📨 HTTP Chat Protocol: Received message from {user_id}: {message}")
        
        # Process message using chat protocol logic
        response_content = await process_merchant_message(message)
        
        # Return response in chat protocol format
        response_message = ChatMessage(
            timestamp=datetime.utcnow(),
            msg_id=uuid4(),
            content=[TextContent(type="text", text=response_content)]
        )
        
        return {
            "chat_message": {
                "timestamp": response_message.timestamp.isoformat(),
                "msg_id": str(response_message.msg_id),
                "content": [
                    {
                        "type": "text",
                        "text": response_content
                    }
                ]
            },
            "agent_id": merchant_agent.address,
            "agent_name": merchant_agent.name,
            "protocol_version": "chat_protocol_v1"
        }
        
    except Exception as e:
        print(f"❌ HTTP Chat Protocol Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/status")
async def get_status():
    """Get agent status with chat protocol information"""
    return {
        "status": "online",
        "agent_id": merchant_agent.address,
        "agent_name": merchant_agent.name,
        "port": 8003,
        "protocols": ["chat_protocol_v1", "http_api"],
        "capabilities": [
            "e-commerce_operations",
            "blockchain_payments",
            "chat_protocol_messaging",
            "payment_verification"
        ],
        "message": f"Merchant agent {merchant_agent.name} is ready for e-commerce and chat operations"
    }

# Fallback chat endpoint for compatibility
@app.post("/chat")
async def fallback_chat_endpoint(request: dict):
    """Fallback chat endpoint for compatibility with existing frontend"""
    try:
        message = request.get("message", "")
        user_id = request.get("user_id", "anonymous")
        
        if not message:
            return {"response": "Please provide a message.", "status": "error"}
        
        print(f"📨 Fallback: Received message from {user_id}: {message}")
        
        # Process message using the same logic as chat protocol
        response_content = await process_merchant_message(message)
        
        print(f"📤 Fallback: Sending response: {response_content[:100]}...")
        
        return {
            "response": response_content,
            "agent_id": merchant_agent.address,
            "agent_name": merchant_agent.name,
            "timestamp": datetime.utcnow().isoformat(),
            "status": "success"
        }
        
    except Exception as e:
        print(f"❌ Fallback Error: {e}")
        import traceback
        traceback.print_exc()
        return {
            "response": "I'm sorry, I'm experiencing technical difficulties. Please try again later.",
            "status": "error",
            "error": str(e)
        }


# Include the chat protocol in the merchant agent
merchant_agent.include(chat_proto, publish_manifest=True)

def run_merchant_and_api():
    """Run both the merchant agent and the HTTP API"""
    # Start the merchant agent in a separate thread
    agent_thread = threading.Thread(target=lambda: merchant_agent.run())
    agent_thread.daemon = True
    agent_thread.start()
    
    # Start the HTTP API server in the main thread
    uvicorn.run(app, host="127.0.0.1", port=8003, log_level="info")

if __name__ == "__main__":
    print("🚀 Starting Merchant Agent with uagents and Chat Protocol...")
    print(f"📍 Agent Name: {merchant_agent.name}")
    print(f"🔗 Agent Address: {merchant_agent.address}")
    print(f"⚡ Agent Port: 8003")
    print(f"🌐 API will be available at: http://127.0.0.1:8003")
    print(f"💬 Chat Protocol: Enabled")
    print(f"🛍️ E-commerce: Ready")
    print(f"🔗 Blockchain: Rootstock integration")
    
    # Run both the agent and API
    run_merchant_and_api()
