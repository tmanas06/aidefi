import os
import threading
from fastapi import FastAPI, HTTPException
from web3 import Web3
from dotenv import load_dotenv
import uvicorn
from uagents import Agent, Context

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

# startup handler
@merchant_agent.on_event("startup")
async def startup_function(ctx: Context):
    ctx.logger.info(f"Hello, I'm merchant agent {merchant_agent.name} and my address is {merchant_agent.address}.")

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


def run_merchant_and_api():
    """Run both the merchant agent and the HTTP API"""
    # Start the merchant agent in a separate thread
    agent_thread = threading.Thread(target=lambda: merchant_agent.run())
    agent_thread.daemon = True
    agent_thread.start()
    
    # Start the HTTP API server in the main thread
    uvicorn.run(app, host="127.0.0.1", port=8003, log_level="info")

if __name__ == "__main__":
    print("🚀 Starting Merchant Agent with uagents...")
    print(f"📍 Agent Name: {merchant_agent.name}")
    print(f"🔗 Agent Address: {merchant_agent.address}")
    print(f"⚡ Agent Port: 8003")
    print(f"🌐 API will be available at: http://127.0.0.1:8003")
    
    # Run both the agent and API
    run_merchant_and_api()
