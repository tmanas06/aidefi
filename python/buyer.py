import os
import threading
import requests
from web3 import Web3
from eth_account import Account
from dotenv import load_dotenv
from uagents import Agent, Context

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

# startup handler
@buyer_agent.on_event("startup")
async def startup_function(ctx: Context):
    ctx.logger.info(f"Hello, I'm buyer agent {buyer_agent.name} and my address is {buyer_agent.address}.")

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


def run_buyer_agent():
    """Run the buyer agent"""
    # Start the buyer agent
    buyer_agent.run()

if __name__ == "__main__":
    print("🚀 Starting Buyer Agent with uagents...")
    print(f"📍 Agent Name: {buyer_agent.name}")
    print(f"🔗 Agent Address: {buyer_agent.address}")
    print(f"⚡ Agent Port: 8000")
    print(f"👤 Buyer Address: {buyer_addr}")
    print(f"🌐 RPC URL: {RPC_URL}")
    print("🛒 Ready for simple token transfers!")
    
    # Optional: Test purchase of item 1
    # Uncomment the line below to test a purchase
    # buy_item(1)
    
    # Start the buyer agent
    run_buyer_agent()
