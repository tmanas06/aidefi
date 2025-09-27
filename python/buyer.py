import os
import requests
from web3 import Web3
from eth_account import Account
from dotenv import load_dotenv

load_dotenv()

RPC_URL = os.getenv("RPC_URL")
PRIVATE_KEY = os.getenv("BUYER_PRIVATE_KEY")
MERCHANT_URL = "http://127.0.0.1:8001"

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
    # Step 1: Ask merchant for item
    resp = requests.post(f"{MERCHANT_URL}/purchase", json={"item_id": item_id})
    payment_info = resp.json()
    print("Merchant response:", payment_info)

    if payment_info.get("status") != "402 Payment Required":
        print("❌ No payment required, aborting")
        return

    token_addr = payment_info["token_address"]
    amount = int(payment_info["amount"])
    recipient = payment_info["recipient_address"]

    # Step 2: Build & send tx
    token = w3.eth.contract(address=token_addr, abi=ERC20_ABI)
    nonce = w3.eth.get_transaction_count(buyer_addr)

    tx = token.functions.transfer(recipient, amount).build_transaction(
        {
            "chainId": w3.eth.chain_id,
            "gas": 100000,
            "gasPrice": w3.eth.gas_price,
            "nonce": nonce,
        }
    )

    signed = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
    tx_hash = w3.eth.send_raw_transaction(signed.rawTransaction)
    tx_hash_hex = w3.to_hex(tx_hash)
    print(f"✅ Payment sent: {tx_hash_hex}")

    # Step 3: Retry purchase
    retry = requests.post(
        f"{MERCHANT_URL}/retry_purchase", json={"tx_hash": tx_hash_hex, "amount": amount}
    )
    print("Merchant verification:", retry.json())


if __name__ == "__main__":
    buy_item(1)  # try buying Crypto Hoodie
