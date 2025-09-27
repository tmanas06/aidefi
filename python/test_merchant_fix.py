#!/usr/bin/env python3
"""
Quick test script to verify the merchant agent chat functionality
"""

import requests
import json
import time

def test_merchant_endpoints():
    """Test all merchant endpoints"""
    base_url = "http://127.0.0.1:8003"
    
    print("🧪 Testing Merchant Agent Endpoints")
    print("=" * 40)
    
    # Test 1: Status endpoint
    print("\n1. Testing status endpoint...")
    try:
        response = requests.get(f"{base_url}/api/status", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Status: {data['status']}")
            print(f"🤖 Agent: {data['agent_name']}")
        else:
            print(f"❌ Status failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Status error: {e}")
    
    # Test 2: Chat endpoint
    print("\n2. Testing /api/chat endpoint...")
    try:
        payload = {
            "message": "Hello! How are you?",
            "user_id": "test_user"
        }
        response = requests.post(f"{base_url}/api/chat", json=payload, timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Response: {data['response'][:100]}...")
        else:
            print(f"❌ Chat failed: {response.status_code}")
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"❌ Chat error: {e}")
    
    # Test 3: Fallback chat endpoint
    print("\n3. Testing /chat endpoint...")
    try:
        payload = {
            "message": "Hi there!",
            "user_id": "test_user_2"
        }
        response = requests.post(f"{base_url}/chat", json=payload, timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Response: {data['response'][:100]}...")
        else:
            print(f"❌ Fallback chat failed: {response.status_code}")
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"❌ Fallback chat error: {e}")
    
    # Test 4: Chat protocol endpoint
    print("\n4. Testing /api/chat-protocol endpoint...")
    try:
        payload = {
            "message": "Show me your products",
            "user_id": "test_user_3"
        }
        response = requests.post(f"{base_url}/api/chat-protocol", json=payload, timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Response: {data['chat_message']['content'][0]['text'][:100]}...")
        else:
            print(f"❌ Chat protocol failed: {response.status_code}")
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"❌ Chat protocol error: {e}")

if __name__ == "__main__":
    print("🚀 Starting Merchant Agent Test")
    print("Make sure the merchant agent is running: python merchant.py")
    print("=" * 50)
    
    test_merchant_endpoints()
    
    print("\n✅ Test completed!")
    print("\nIf you see errors, check:")
    print("1. Is the merchant agent running? (python merchant.py)")
    print("2. Are there any error messages in the agent console?")
    print("3. Is port 8003 available?")
