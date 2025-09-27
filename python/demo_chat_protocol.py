#!/usr/bin/env python3
"""
Demo script showing how to use the Merchant Agent Chat Protocol

This script demonstrates the key features of the chat protocol integration
without requiring a full agent setup.
"""

import requests
import json
from datetime import datetime

# Configuration
MERCHANT_URL = "http://127.0.0.1:8003"

def demo_http_chat():
    """Demonstrate HTTP chat functionality"""
    print("🌐 HTTP Chat Protocol Demo")
    print("=" * 40)
    
    # Test messages
    test_messages = [
        "Hello! I'm interested in your products.",
        "Can you show me what you have available?",
        "I want to buy item 1",
        "How do I verify a payment?",
        "What can you help me with?"
    ]
    
    for i, message in enumerate(test_messages, 1):
        print(f"\n{i}. Sending: '{message}'")
        
        try:
            response = requests.post(f"{MERCHANT_URL}/api/chat", 
                                   json={"message": message, "user_id": f"demo_user_{i}"},
                                   timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                print(f"   ✅ Response: {data['response'][:100]}...")
                print(f"   📅 Timestamp: {data['timestamp']}")
                print(f"   🔧 Protocol: {data['protocol']}")
            else:
                print(f"   ❌ Error: {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            print(f"   ❌ Connection Error: {e}")

def demo_chat_protocol_format():
    """Demonstrate chat protocol message format"""
    print("\n\n💬 Chat Protocol Message Format Demo")
    print("=" * 40)
    
    message = "I want to purchase the Crypto Hoodie"
    print(f"Sending: '{message}'")
    
    try:
        response = requests.post(f"{MERCHANT_URL}/api/chat-protocol",
                               json={"message": message, "user_id": "demo_protocol_user"},
                               timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print("\n📨 Chat Protocol Response:")
            print(f"   🆔 Message ID: {data['chat_message']['msg_id']}")
            print(f"   📅 Timestamp: {data['chat_message']['timestamp']}")
            print(f"   📝 Content Type: {data['chat_message']['content'][0]['type']}")
            print(f"   💬 Message: {data['chat_message']['content'][0]['text'][:100]}...")
            print(f"   🤖 Agent: {data['agent_name']} ({data['agent_id'][:20]}...)")
            print(f"   📋 Protocol Version: {data['protocol_version']}")
        else:
            print(f"   ❌ Error: {response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print(f"   ❌ Connection Error: {e}")

def demo_agent_status():
    """Demonstrate agent status checking"""
    print("\n\n📊 Agent Status Demo")
    print("=" * 40)
    
    try:
        response = requests.get(f"{MERCHANT_URL}/api/status", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print("🤖 Agent Information:")
            print(f"   📛 Name: {data['agent_name']}")
            print(f"   🆔 ID: {data['agent_id']}")
            print(f"   📍 Port: {data['port']}")
            print(f"   📡 Status: {data['status']}")
            print(f"   🔧 Protocols: {', '.join(data['protocols'])}")
            print(f"   ⚡ Capabilities:")
            for capability in data['capabilities']:
                print(f"      • {capability}")
        else:
            print(f"   ❌ Error: {response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print(f"   ❌ Connection Error: {e}")

def demo_products():
    """Demonstrate product listing"""
    print("\n\n🛍️ Product Catalog Demo")
    print("=" * 40)
    
    try:
        response = requests.get(f"{MERCHANT_URL}/goods", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print(f"📦 Available Products ({len(data['items'])} items):")
            
            for item in data['items']:
                if 'price_tokens' in item:
                    print(f"   • {item['name']} - {item['price_tokens']} rUSDT (ID: {item['id']})")
                else:
                    print(f"   • {item['name']} - ${item['price_usd']} (ID: {item['id']})")
        else:
            print(f"   ❌ Error: {response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print(f"   ❌ Connection Error: {e}")

def main():
    """Run the complete demo"""
    print("🚀 Merchant Agent Chat Protocol Demo")
    print("=" * 50)
    print(f"📅 Demo Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🎯 Target: {MERCHANT_URL}")
    print("=" * 50)
    
    # Check if merchant agent is running
    try:
        response = requests.get(f"{MERCHANT_URL}/api/status", timeout=5)
        if response.status_code != 200:
            print("❌ Merchant agent is not running!")
            print("Please start the merchant agent first:")
            print("   cd python && python merchant.py")
            return
    except requests.exceptions.RequestException:
        print("❌ Cannot connect to merchant agent!")
        print("Please start the merchant agent first:")
        print("   cd python && python merchant.py")
        return
    
    # Run demos
    demo_agent_status()
    demo_products()
    demo_http_chat()
    demo_chat_protocol_format()
    
    print("\n\n✅ Demo completed successfully!")
    print("\n💡 Next Steps:")
    print("   1. Try the test script: python test_chat_protocol.py")
    print("   2. Integrate with your frontend application")
    print("   3. Create custom agents that communicate via chat protocol")
    print("   4. Explore the Fetch.ai agent ecosystem")

if __name__ == "__main__":
    main()
