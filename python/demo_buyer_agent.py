#!/usr/bin/env python3
"""
Demo script showing how to interact with the Buyer Agent
using the Agent Chat Protocol
"""

import requests
import json
from datetime import datetime

# Configuration
BUYER_HTTP_URL = "http://127.0.0.1:8000"  # Note: Buyer agent might not have HTTP endpoints
MERCHANT_HTTP_URL = "http://127.0.0.1:8003"

def demo_buyer_agent_info():
    """Demonstrate buyer agent information"""
    print("🛒 Buyer Agent Demo")
    print("=" * 40)
    
    print("📋 Buyer Agent Information:")
    print(f"   🤖 Name: buyer")
    print(f"   🔗 Address: agent1q0f4v...46he5w0vxfupadt")
    print(f"   📍 Endpoint: http://localhost:8000/submit")
    print(f"   💬 Protocol: AgentChatProtocol v0.3.0")
    print(f"   ⚡ Port: 8000")
    
    print("\n🔧 Capabilities:")
    print("   • Chat Protocol messaging")
    print("   • Blockchain purchases")
    print("   • rUSDT token transfers")
    print("   • Payment verification")
    print("   • Transaction tracking")

def demo_merchant_communication():
    """Demonstrate communication with merchant agent"""
    print("\n🏪 Merchant Communication Demo")
    print("=" * 40)
    
    # Test merchant agent
    try:
        response = requests.get(f"{MERCHANT_HTTP_URL}/api/status", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print("✅ Merchant agent is online")
            print(f"   🤖 Agent: {data['agent_name']}")
            print(f"   📡 Status: {data['status']}")
            print(f"   🔧 Protocols: {', '.join(data['protocols'])}")
        else:
            print(f"❌ Merchant agent not responding: {response.status_code}")
            return
    except requests.exceptions.RequestException as e:
        print(f"❌ Cannot connect to merchant agent: {e}")
        return
    
    # Test chat with merchant
    print("\n💬 Chat with Merchant Agent:")
    test_messages = [
        "Hello! I'm a buyer agent. Can you show me your products?",
        "I want to buy the Crypto Hoodie",
        "What's the price for item 1?",
        "How do I make a payment?"
    ]
    
    for i, message in enumerate(test_messages, 1):
        print(f"\n{i}. Sending: '{message}'")
        
        try:
            response = requests.post(f"{MERCHANT_HTTP_URL}/api/chat",
                                   json={"message": message, "user_id": f"buyer_agent_{i}"},
                                   timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                print(f"   ✅ Response: {data['response'][:100]}...")
            else:
                print(f"   ❌ Error: {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            print(f"   ❌ Connection Error: {e}")

def demo_buyer_capabilities():
    """Demonstrate buyer agent capabilities"""
    print("\n🛒 Buyer Agent Capabilities Demo")
    print("=" * 40)
    
    print("The buyer agent can help you with:")
    print("\n1. 💬 **Chat Protocol Communication**")
    print("   • Structured message handling")
    print("   • Message acknowledgements")
    print("   • Real-time agent-to-agent messaging")
    
    print("\n2. 🛍️ **Purchase Operations**")
    print("   • Browse merchant products")
    print("   • Process crypto payments")
    print("   • Handle rUSDT transactions")
    print("   • Verify payment completion")
    
    print("\n3. 🔗 **Blockchain Integration**")
    print("   • Rootstock network support")
    print("   • ERC-20 token transfers")
    print("   • Transaction verification")
    print("   • Smart contract interaction")
    
    print("\n4. 📊 **Transaction Management**")
    print("   • Payment status tracking")
    print("   • Transaction history")
    print("   • Blockchain explorer links")
    print("   • Error handling and recovery")

def demo_agent_interaction():
    """Demonstrate how agents interact"""
    print("\n🤝 Agent Interaction Demo")
    print("=" * 40)
    
    print("Here's how the buyer and merchant agents work together:")
    
    print("\n1. 📞 **Initial Contact**")
    print("   Buyer Agent → Merchant Agent: 'Show me your products'")
    print("   Merchant Agent → Buyer Agent: 'Here are our available items'")
    
    print("\n2. 🛒 **Purchase Request**")
    print("   Buyer Agent → Merchant Agent: 'I want to buy item 1'")
    print("   Merchant Agent → Buyer Agent: 'Payment details: 5 rUSDT to address...'")
    
    print("\n3. 💳 **Payment Processing**")
    print("   Buyer Agent → Blockchain: 'Transfer 5 rUSDT'")
    print("   Blockchain → Buyer Agent: 'Transaction confirmed: 0x123...'")
    
    print("\n4. ✅ **Verification**")
    print("   Buyer Agent → Merchant Agent: 'Payment sent: 0x123...'")
    print("   Merchant Agent → Buyer Agent: 'Payment verified! Here are your goods'")

def main():
    """Run the complete demo"""
    print("🚀 Buyer Agent Chat Protocol Demo")
    print("=" * 50)
    print(f"📅 Demo Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 50)
    
    demo_buyer_agent_info()
    demo_buyer_capabilities()
    demo_agent_interaction()
    demo_merchant_communication()
    
    print("\n\n✅ Demo completed successfully!")
    print("\n💡 Next Steps:")
    print("   1. Start the buyer agent: python buyer.py")
    print("   2. Start the merchant agent: python merchant.py")
    print("   3. Use Agentverse to interact with the buyer agent")
    print("   4. Test agent-to-agent communication")
    print("   5. Try making a purchase through the chat protocol")
    
    print("\n🔗 Agent Information:")
    print(f"   Buyer Agent: agent1q0f4v...46he5w0vxfupadt")
    print(f"   Endpoint: http://localhost:8000/submit")
    print(f"   Protocol: AgentChatProtocol v0.3.0")

if __name__ == "__main__":
    main()
