#!/usr/bin/env python3
"""
Simple test script for token transfer from buyer to merchant
"""

import os
import sys
from dotenv import load_dotenv

# Add the current directory to Python path to import buyer module
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from buyer import buy_item

load_dotenv()

def test_purchase():
    """Test a simple purchase"""
    print("🧪 Testing Simple Token Transfer...")
    print("=" * 50)
    
    # Test purchasing item 1 (Crypto Hoodie - 5 tokens)
    result = buy_item(1)
    
    print("=" * 50)
    print("📊 Test Result:")
    print(result)
    
    if result.get("success"):
        print("✅ Purchase successful!")
        print(f"Transaction: {result.get('tx_hash')}")
    else:
        print("❌ Purchase failed!")
        print(f"Error: {result.get('error')}")

if __name__ == "__main__":
    test_purchase()
