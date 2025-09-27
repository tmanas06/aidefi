#!/usr/bin/env python3
"""
Test script for Merchant Agent Chat Protocol Integration

This script demonstrates how to interact with the merchant agent
using both the chat protocol and HTTP API endpoints.
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

# Create a test agent to communicate with the merchant
test_agent = Agent(
    name="test_client",
    seed="test_client_seed_phrase_12345",
    port=8004
)

# Initialize chat protocol
chat_proto = Protocol(spec=chat_protocol_spec)

# Merchant agent address (you'll need to replace this with actual address)
MERCHANT_ADDRESS = "agent1q..."  # Replace with actual merchant agent address
MERCHANT_HTTP_URL = "http://127.0.0.1:8003"

@test_agent.on_event("startup")
async def startup_handler(ctx: Context):
    """Startup handler for test agent"""
    ctx.logger.info(f"Test agent {test_agent.name} started at {test_agent.address}")
    
    # Test HTTP API first
    await test_http_api()
    
    # Then test chat protocol (if merchant address is available)
    if MERCHANT_ADDRESS != "agent1q...":
        await test_chat_protocol(ctx)
    else:
        ctx.logger.info("Skipping chat protocol test - merchant address not configured")

async def test_http_api():
    """Test the HTTP API endpoints"""
    print("\n🧪 Testing HTTP API Endpoints")
    print("=" * 50)
    
    try:
        # Test status endpoint
        print("1. Testing /api/status endpoint...")
        response = requests.get(f"{MERCHANT_HTTP_URL}/api/status")
        if response.status_code == 200:
            status_data = response.json()
            print(f"✅ Status: {status_data['status']}")
            print(f"📋 Protocols: {status_data['protocols']}")
            print(f"🔧 Capabilities: {status_data['capabilities']}")
        else:
            print(f"❌ Status endpoint failed: {response.status_code}")
        
        # Test chat endpoint
        print("\n2. Testing /api/chat endpoint...")
        chat_data = {
            "message": "Hello! Can you show me your products?",
            "user_id": "test_user_123"
        }
        response = requests.post(f"{MERCHANT_HTTP_URL}/api/chat", json=chat_data)
        if response.status_code == 200:
            chat_response = response.json()
            print(f"✅ Chat Response: {chat_response['response'][:100]}...")
            print(f"📅 Timestamp: {chat_response['timestamp']}")
            print(f"🔧 Protocol: {chat_response['protocol']}")
        else:
            print(f"❌ Chat endpoint failed: {response.status_code}")
        
        # Test chat protocol endpoint
        print("\n3. Testing /api/chat-protocol endpoint...")
        protocol_data = {
            "message": "I want to buy item 1",
            "user_id": "test_user_456"
        }
        response = requests.post(f"{MERCHANT_HTTP_URL}/api/chat-protocol", json=protocol_data)
        if response.status_code == 200:
            protocol_response = response.json()
            print(f"✅ Protocol Response: {protocol_response['chat_message']['content'][0]['text'][:100]}...")
            print(f"🆔 Message ID: {protocol_response['chat_message']['msg_id']}")
            print(f"📋 Protocol Version: {protocol_response['protocol_version']}")
        else:
            print(f"❌ Chat protocol endpoint failed: {response.status_code}")
        
        # Test goods endpoint
        print("\n4. Testing /goods endpoint...")
        response = requests.get(f"{MERCHANT_HTTP_URL}/goods")
        if response.status_code == 200:
            goods_data = response.json()
            print(f"✅ Found {len(goods_data['items'])} products")
            for item in goods_data['items'][:3]:  # Show first 3 items
                print(f"   • {item['name']} - ID: {item['id']}")
        else:
            print(f"❌ Goods endpoint failed: {response.status_code}")
            
    except Exception as e:
        print(f"❌ HTTP API test failed: {e}")

async def test_chat_protocol(ctx: Context):
    """Test the chat protocol communication"""
    print("\n💬 Testing Chat Protocol Communication")
    print("=" * 50)
    
    try:
        # Send initial message to merchant
        message = ChatMessage(
            timestamp=datetime.utcnow(),
            msg_id=uuid4(),
            content=[TextContent(type="text", text="Hello Merchant! I'm interested in your products.")]
        )
        
        ctx.logger.info(f"Sending chat message to merchant: {MERCHANT_ADDRESS}")
        await ctx.send(MERCHANT_ADDRESS, message)
        
    except Exception as e:
        ctx.logger.error(f"Chat protocol test failed: {e}")

# Chat protocol message handler
@chat_proto.on_message(ChatMessage)
async def handle_merchant_message(ctx: Context, sender: str, msg: ChatMessage):
    """Handle messages from merchant agent"""
    ctx.logger.info(f"Received message from merchant {sender}")
    
    for item in msg.content:
        if isinstance(item, TextContent):
            ctx.logger.info(f"Merchant says: {item.text}")
            
            # Send acknowledgment
            ack = ChatAcknowledgement(
                timestamp=datetime.utcnow(),
                acknowledged_msg_id=msg.msg_id
            )
            await ctx.send(sender, ack)
            
            # Send follow-up message
            response = ChatMessage(
                timestamp=datetime.utcnow(),
                msg_id=uuid4(),
                content=[TextContent(type="text", text="Thank you for the information!")]
            )
            await ctx.send(sender, response)

# Chat protocol acknowledgement handler
@chat_proto.on_message(ChatAcknowledgement)
async def handle_acknowledgement(ctx: Context, sender: str, msg: ChatAcknowledgement):
    """Handle acknowledgements from merchant agent"""
    ctx.logger.info(f"Received acknowledgement from {sender} for message: {msg.acknowledged_msg_id}")

# Include chat protocol in test agent
test_agent.include(chat_proto, publish_manifest=True)

def test_merchant_integration():
    """Run comprehensive tests"""
    print("🚀 Starting Merchant Agent Chat Protocol Tests")
    print("=" * 60)
    print(f"📅 Test Time: {datetime.now().isoformat()}")
    print(f"🎯 Target: {MERCHANT_HTTP_URL}")
    print(f"🤖 Test Agent: {test_agent.name} ({test_agent.address})")
    print("=" * 60)
    
    # Run the test agent
    test_agent.run()

if __name__ == "__main__":
    test_merchant_integration()
