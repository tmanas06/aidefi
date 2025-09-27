#!/usr/bin/env python3
"""
Test script to demonstrate communication between buyer and merchant agents
using the Agent Chat Protocol
"""

import asyncio
import requests
import json
from datetime import datetime
from uuid import uuid4
from uagents import Agent, Context
from uagents_core.contrib.protocols.chat import (
    ChatMessage,
    ChatAcknowledgement,
    TextContent,
    chat_protocol_spec
)
from uagents import Protocol

# Create a test client agent to communicate with both buyer and merchant
test_client = Agent(
    name="test_client",
    seed="test_client_seed_phrase_12345",
    port=8005
)

# Initialize chat protocol
chat_proto = Protocol(spec=chat_protocol_spec)

# Agent addresses (you'll need to replace these with actual addresses)
BUYER_ADDRESS = "agent1q0f4v...46he5w0vxfupadt"  # Replace with actual buyer agent address
MERCHANT_ADDRESS = "agent1q..."  # Replace with actual merchant agent address

# HTTP endpoints
BUYER_HTTP_URL = "http://127.0.0.1:8000"
MERCHANT_HTTP_URL = "http://127.0.0.1:8003"

@test_client.on_event("startup")
async def startup_handler(ctx: Context):
    """Startup handler for test client"""
    ctx.logger.info(f"Test client {test_client.name} started at {test_client.address}")
    
    # Test HTTP communication first
    await test_http_communication()
    
    # Test agent-to-agent communication if addresses are configured
    if BUYER_ADDRESS != "agent1q0f4v...46he5w0vxfupadt" and MERCHANT_ADDRESS != "agent1q...":
        await test_agent_to_agent_communication(ctx)
    else:
        ctx.logger.info("Skipping agent-to-agent test - addresses not configured")

async def test_http_communication():
    """Test HTTP communication with both agents"""
    print("\n🌐 Testing HTTP Communication")
    print("=" * 40)
    
    # Test buyer agent HTTP endpoints (if available)
    print("\n1. Testing Buyer Agent HTTP...")
    try:
        # Note: Buyer agent might not have HTTP endpoints, this is just a placeholder
        response = requests.get(f"{BUYER_HTTP_URL}/status", timeout=5)
        if response.status_code == 200:
            print("✅ Buyer agent HTTP is responding")
        else:
            print(f"❌ Buyer agent HTTP failed: {response.status_code}")
    except requests.exceptions.RequestException:
        print("ℹ️ Buyer agent doesn't have HTTP endpoints (expected)")
    
    # Test merchant agent HTTP endpoints
    print("\n2. Testing Merchant Agent HTTP...")
    try:
        response = requests.get(f"{MERCHANT_HTTP_URL}/api/status", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Merchant agent HTTP is responding")
            print(f"   Agent: {data['agent_name']}")
            print(f"   Protocols: {data['protocols']}")
        else:
            print(f"❌ Merchant agent HTTP failed: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Merchant agent HTTP error: {e}")
    
    # Test chat with merchant
    print("\n3. Testing Chat with Merchant...")
    try:
        chat_data = {
            "message": "Hello! I'm a test client. Can you show me your products?",
            "user_id": "test_client_123"
        }
        response = requests.post(f"{MERCHANT_HTTP_URL}/api/chat", json=chat_data, timeout=10)
        if response.status_code == 200:
            chat_response = response.json()
            print(f"✅ Chat successful: {chat_response['response'][:100]}...")
        else:
            print(f"❌ Chat failed: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Chat error: {e}")

async def test_agent_to_agent_communication(ctx: Context):
    """Test agent-to-agent communication using chat protocol"""
    print("\n💬 Testing Agent-to-Agent Communication")
    print("=" * 40)
    
    try:
        # Send message to buyer agent
        print("\n1. Sending message to Buyer Agent...")
        message_to_buyer = ChatMessage(
            timestamp=datetime.utcnow(),
            msg_id=uuid4(),
            content=[TextContent(type="text", text="Hello Buyer! I want to buy something.")]
        )
        
        ctx.logger.info(f"Sending message to buyer: {BUYER_ADDRESS}")
        await ctx.send(BUYER_ADDRESS, message_to_buyer)
        
        # Send message to merchant agent
        print("\n2. Sending message to Merchant Agent...")
        message_to_merchant = ChatMessage(
            timestamp=datetime.utcnow(),
            msg_id=uuid4(),
            content=[TextContent(type="text", text="Hello Merchant! Show me your products.")]
        )
        
        ctx.logger.info(f"Sending message to merchant: {MERCHANT_ADDRESS}")
        await ctx.send(MERCHANT_ADDRESS, message_to_merchant)
        
    except Exception as e:
        ctx.logger.error(f"Agent-to-agent communication test failed: {e}")

# Chat protocol message handler
@chat_proto.on_message(ChatMessage)
async def handle_agent_message(ctx: Context, sender: str, msg: ChatMessage):
    """Handle messages from other agents"""
    ctx.logger.info(f"Received message from agent {sender}")
    
    for item in msg.content:
        if isinstance(item, TextContent):
            ctx.logger.info(f"Agent says: {item.text}")
            
            # Send acknowledgment
            ack = ChatAcknowledgement(
                timestamp=datetime.utcnow(),
                acknowledged_msg_id=msg.msg_id
            )
            await ctx.send(sender, ack)
            
            # Send response
            response = ChatMessage(
                timestamp=datetime.utcnow(),
                msg_id=uuid4(),
                content=[TextContent(type="text", text="Thank you for the message!")]
            )
            await ctx.send(sender, response)

# Chat protocol acknowledgement handler
@chat_proto.on_message(ChatAcknowledgement)
async def handle_acknowledgement(ctx: Context, sender: str, msg: ChatAcknowledgement):
    """Handle acknowledgements from other agents"""
    ctx.logger.info(f"Received acknowledgement from {sender} for message: {msg.acknowledged_msg_id}")

# Include chat protocol in test client
test_client.include(chat_proto, publish_manifest=True)

def test_agent_communication():
    """Run comprehensive agent communication tests"""
    print("🚀 Starting Buyer-Merchant Agent Communication Tests")
    print("=" * 60)
    print(f"📅 Test Time: {datetime.now().isoformat()}")
    print(f"🎯 Buyer: {BUYER_HTTP_URL}")
    print(f"🎯 Merchant: {MERCHANT_HTTP_URL}")
    print(f"🤖 Test Client: {test_client.name} ({test_client.address})")
    print("=" * 60)
    
    # Run the test client
    test_client.run()

if __name__ == "__main__":
    test_agent_communication()
