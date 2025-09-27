import os
import threading
import requests
from datetime import datetime
from uuid import uuid4
from web3 import Web3
from eth_account import Account
from dotenv import load_dotenv
from uagents import Agent, Context, Protocol
from typing import Dict, Any

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

RPC_URL = os.getenv("RPC_URL")
PRIVATE_KEY = os.getenv("BUYER_PRIVATE_KEY")

# Create uagents buyer agent using private key
buyer_agent = Agent(
    name="buyer",
    seed=PRIVATE_KEY,
    port=8000,
    endpoint=["http://localhost:8000/submit"],
    publish_agent_details=True
)

# Initialize the chat protocol
chat_proto = Protocol(spec=chat_protocol_spec)

# startup handler
@buyer_agent.on_event("startup")
async def startup_function(ctx: Context):
    ctx.logger.info(f"Hello, I'm buyer agent {buyer_agent.name} and my address is {buyer_agent.address}.")
    ctx.logger.info("Buyer agent is ready to handle chat protocol messages and purchase operations.")

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
            response_text = await process_buyer_message(item.text)
            
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

async def process_buyer_message(message: str) -> str:
    """Process incoming chat messages and generate buyer-specific responses"""
    message_lower = message.lower()
    
    # Handle different types of buyer inquiries
    if any(keyword in message_lower for keyword in ["hello", "hi", "greetings"]):
        return """🛒 **Welcome! I'm the Buyer Agent!**

I can help you with:

• **Browse Products**: Check what's available for purchase
• **Make Purchases**: Buy items with rUSDT tokens
• **Payment Processing**: Handle blockchain transactions
• **Transaction Tracking**: Monitor payment status

What would you like to buy today?"""

    elif any(keyword in message_lower for keyword in ["buy", "purchase", "order", "item"]):
        return """💳 **Ready to Make a Purchase!**

I can help you buy items from the merchant. To get started:

• Tell me which item you want (by ID or name)
• I'll handle the payment process
• You'll get transaction confirmation

Which item would you like to purchase? (Available: Crypto Hoodie, NFT Poster, etc.)"""

    elif any(keyword in message_lower for keyword in ["products", "catalog", "inventory", "goods"]):
        return """📦 **Let me check the available products...**

I'll contact the merchant to get the latest product catalog for you. One moment please!"""

    elif any(keyword in message_lower for keyword in ["payment", "transaction", "status"]):
        return """🔍 **Payment Information**

I can help you with:
• Check transaction status
• Verify payment completion
• Get transaction details
• View blockchain explorer links

What payment would you like me to check?"""

    elif any(keyword in message_lower for keyword in ["balance", "wallet", "tokens"]):
        return f"""💰 **Wallet Information**

Your buyer wallet address: `{buyer_addr}`
Network: Rootstock Testnet
RPC: {RPC_URL}

I can help you check balances and manage payments. What would you like to know?"""

    elif any(keyword in message_lower for keyword in ["help", "support", "assistance"]):
        return """❓ **Buyer Agent Help**

I'm a blockchain-enabled buyer agent that can:

**🛒 Purchase Operations:**
• Browse merchant products
• Process crypto payments
• Handle rUSDT transactions
• Verify payment completion

**💬 Chat Protocol Features:**
• Structured message handling
• Message acknowledgements
• Real-time communication
• Agent-to-agent messaging

**🔗 Blockchain Integration:**
• Rootstock network support
• ERC-20 token transfers
• Transaction verification
• Smart contract interaction

How can I assist you today?"""

    else:
        return """🤔 **I'm not sure I understand that request.**

I specialize in blockchain purchases and payments. You can ask me about:

• "Show me products" - Browse available items
• "Buy item 1" - Purchase specific items
• "Check my balance" - View wallet information
• "Help" - Get assistance

What would you like to do?"""

MERCHANT_URL = "http://127.0.0.1:8003"

w3 = Web3(Web3.HTTPProvider(RPC_URL))
acct = Account.from_key(PRIVATE_KEY)
buyer_addr = acct.address

ERC20_ABI = [
    {
        "constant": False,
        "inputs": [
            {"name": "_to", "type": "address"},
            {"name": "_value", "type": "uint256"},
        ],
        "name": "transfer",
        "outputs": [{"name": "", "type": "bool"}],
        "type": "function",
    }
]


def buy_item(item_id: int):
    """
    Simple token transfer from buyer to merchant
    """
    try:
        print(f"🛒 Buying item {item_id}...")
        print(f"👤 Buyer Address: {buyer_addr}")
        
        # Step 1: Get payment details from merchant
        resp = requests.post(f"{MERCHANT_URL}/purchase", json={"item_id": item_id})
        payment_info = resp.json()
        print("📋 Payment Info:", payment_info)

        if payment_info.get("status") != "402 Payment Required":
            print("❌ No payment required, aborting")
            return {"error": "No payment required"}

        token_addr = payment_info["token_address"]
        amount = int(payment_info["amount"])
        recipient = payment_info["recipient_address"]
        
        print(f"💰 Amount: {amount}")
        print(f"🏪 Recipient: {recipient}")

        # Step 2: Simple token transfer
        token = w3.eth.contract(address=token_addr, abi=ERC20_ABI)
        nonce = w3.eth.get_transaction_count(buyer_addr)

        # Build transaction
        tx = token.functions.transfer(recipient, amount).build_transaction({
            "chainId": w3.eth.chain_id,
            "gas": 100000,
            "gasPrice": w3.eth.gas_price,
            "nonce": nonce,
        })

        # Sign and send transaction
        signed = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed.rawTransaction)
        tx_hash_hex = w3.to_hex(tx_hash)
        
        print(f"✅ Payment sent! Transaction: {tx_hash_hex}")
        print(f"🔗 Explorer: https://explorer.testnet.rsk.co/tx/{tx_hash_hex}")

        # Step 3: Notify merchant of payment
        retry = requests.post(
            f"{MERCHANT_URL}/retry_purchase", 
            json={"tx_hash": tx_hash_hex, "amount": amount}
        )
        verification = retry.json()
        print("✅ Merchant verification:", verification)
        
        return {
            "success": True,
            "tx_hash": tx_hash_hex,
            "amount": amount,
            "recipient": recipient
        }
        
    except Exception as e:
        print(f"❌ Error during purchase: {str(e)}")
        return {"error": str(e)}


# Include the chat protocol in the buyer agent
buyer_agent.include(chat_proto, publish_manifest=True)

def run_buyer_agent():
    """Run the buyer agent"""
    # Start the buyer agent
    buyer_agent.run()

if __name__ == "__main__":
    print("🚀 Starting Buyer Agent with uagents and Chat Protocol...")
    print(f"📍 Agent Name: {buyer_agent.name}")
    print(f"🔗 Agent Address: {buyer_agent.address}")
    print(f"⚡ Agent Port: 8000")
    print(f"👤 Buyer Address: {buyer_addr}")
    print(f"🌐 RPC URL: {RPC_URL}")
    print(f"💬 Chat Protocol: Enabled")
    print(f"🛒 E-commerce: Ready")
    print(f"🔗 Blockchain: Rootstock integration")
    
    # Optional: Test purchase of item 1
    # Uncomment the line below to test a purchase
    # buy_item(1)
    
    # Start the buyer agent
    run_buyer_agent()
