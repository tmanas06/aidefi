#!/usr/bin/env python3
"""
Wallet Agent for EthGlobal dApp
Handles wallet operations and user requests via ASI:One Chat Protocol
"""

import asyncio
import os
import json
from typing import Dict, Any, Optional
from uagents import Agent, Context, Model
from uagents.network import Network
from dotenv import load_dotenv
import httpx
from gemini_client import gemini_client

# Load environment variables
load_dotenv()

# Agent configuration
WALLET_AGENT_ID = os.getenv("WALLET_AGENT_ID", "wallet_agent_001")
WALLET_AGENT_SECRET = os.getenv("WALLET_AGENT_SECRET", "wallet_secret_key")
AGENTVERSE_URL = os.getenv("ASI_AGENTVERSE_URL", "https://agentverse.asi.one")
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:3001")

# Brewit configuration
BREWIT_API_KEY = os.getenv("BREWIT_API_KEY", "")
BREWIT_BASE_URL = os.getenv("BREWIT_BASE_URL", "https://api.brewit.money")

# Create the wallet agent
wallet_agent = Agent(
    name="Wallet Agent",
    seed=WALLET_AGENT_SECRET,
    port=8001,
    endpoint=[f"http://localhost:8001/submit"],
)

# Message models
class WalletRequest(Model):
    user_address: str
    action: str
    params: Dict[str, Any]
    request_id: str

class WalletResponse(Model):
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None
    request_id: str

class PaymentRequest(Model):
    user_address: str
    to_address: str
    amount: str
    currency: str
    request_id: str

class PaymentResponse(Model):
    success: bool
    transaction_hash: Optional[str] = None
    message: str
    request_id: str

class DelegatedWalletRequest(Model):
    user_address: str
    wallet_type: str  # "bot_pol", "bot_eth", "bot_matic", "user_delegated"
    custom_name: Optional[str] = None
    request_id: str

class DelegatedWalletResponse(Model):
    success: bool
    wallet_address: Optional[str] = None
    message: str
    request_id: str

class AutomatedOperationRequest(Model):
    user_address: str
    wallet_address: str
    operation_name: str
    task_type: str  # "send", "swap", "stake", "unstake", "claim"
    operation_params: Dict[str, Any]
    request_id: str

class AutomatedOperationResponse(Model):
    success: bool
    operation_id: Optional[str] = None
    message: str
    request_id: str

# MeTTa rules for wallet operations
WALLET_RULES = {
    "balance_check": {
        "min_balance": 0.001,  # Minimum MATIC balance
        "warning_threshold": 0.01
    },
    "transaction_limits": {
        "max_daily": 1000.0,  # Max daily transaction volume
        "max_single": 100.0   # Max single transaction
    },
    "security_rules": {
        "require_identity_verification": 50.0,  # Require ID verification for amounts > $50
        "require_2fa": 200.0  # Require 2FA for amounts > $200
    }
}

@wallet_agent.on_message(model=WalletRequest)
async def handle_wallet_request(ctx: Context, sender: str, msg: WalletRequest):
    """Handle general wallet requests"""
    ctx.logger.info(f"Received wallet request: {msg.action} from {msg.user_address}")
    
    try:
        if msg.action == "get_balance":
            response = await get_wallet_balance(msg.user_address, msg.params.get("currency", "MATIC"))
        elif msg.action == "get_transaction_history":
            response = await get_transaction_history(msg.user_address, msg.params)
        elif msg.action == "check_limits":
            response = await check_transaction_limits(msg.user_address, msg.params)
        elif msg.action == "get_security_status":
            response = await get_security_status(msg.user_address)
        else:
            response = {
                "success": False,
                "message": f"Unknown action: {msg.action}",
                "data": None
            }
        
        # Generate AI-powered response using Gemini
        ai_response = await gemini_client.generate_agent_response(
            f"User requested {msg.action} with params {msg.params}",
            "wallet-agent",
            {"user_address": msg.user_address, "response": response}
        )
        
        # Combine technical response with AI insights
        enhanced_message = f"{response['message']}\n\nAI Insights: {ai_response}"
        
        # Send response back to user
        await ctx.send(
            sender,
            WalletResponse(
                success=response["success"],
                message=enhanced_message,
                data=response.get("data"),
                request_id=msg.request_id
            )
        )
        
    except Exception as e:
        ctx.logger.error(f"Error handling wallet request: {e}")
        await ctx.send(
            sender,
            WalletResponse(
                success=False,
                message=f"Error processing request: {str(e)}",
                request_id=msg.request_id
            )
        )

@wallet_agent.on_message(model=DelegatedWalletRequest)
async def handle_delegated_wallet_request(ctx: Context, sender: str, msg: DelegatedWalletRequest):
    """Handle delegated wallet creation requests"""
    ctx.logger.info(f"Received delegated wallet request: {msg.wallet_type} for {msg.user_address}")
    
    try:
        # Create delegated wallet via backend API
        async with httpx.AsyncClient() as client:
            if msg.wallet_type.startswith("bot_"):
                # Create bot wallet
                response = await client.post(
                    f"{BACKEND_URL}/api/brewit/wallets/bot",
                    json={
                        "botType": msg.wallet_type.split("_")[1],  # Extract "pol", "eth", "matic"
                        "customName": msg.custom_name
                    }
                )
            else:
                # Create user delegated wallet
                response = await client.post(
                    f"{BACKEND_URL}/api/brewit/wallets/user-delegated",
                    json={
                        "userAddress": msg.user_address,
                        "customName": msg.custom_name
                    }
                )
            
            if response.status_code == 200:
                wallet_data = response.json()
                wallet_address = wallet_data["wallet"]["address"]
                
                # Generate AI response
                ai_response = await gemini_client.generate_agent_response(
                    f"Created {msg.wallet_type} delegated wallet for user",
                    "wallet-agent",
                    {"wallet_type": msg.wallet_type, "wallet_address": wallet_address}
                )
                
                await ctx.send(
                    sender,
                    DelegatedWalletResponse(
                        success=True,
                        wallet_address=wallet_address,
                        message=f"Delegated wallet created successfully. {ai_response}",
                        request_id=msg.request_id
                    )
                )
            else:
                await ctx.send(
                    sender,
                    DelegatedWalletResponse(
                        success=False,
                        message=f"Failed to create delegated wallet: {response.text}",
                        request_id=msg.request_id
                    )
                )
                
    except Exception as e:
        ctx.logger.error(f"Error creating delegated wallet: {e}")
        await ctx.send(
            sender,
            DelegatedWalletResponse(
                success=False,
                message=f"Error creating delegated wallet: {str(e)}",
                request_id=msg.request_id
            )
        )

@wallet_agent.on_message(model=AutomatedOperationRequest)
async def handle_automated_operation_request(ctx: Context, sender: str, msg: AutomatedOperationRequest):
    """Handle automated operation creation requests"""
    ctx.logger.info(f"Received automated operation request: {msg.operation_name} for {msg.wallet_address}")
    
    try:
        # Create automated operation via backend API
        async with httpx.AsyncClient() as client:
            if msg.task_type == "swap":
                response = await client.post(
                    f"{BACKEND_URL}/api/brewit/operations/trading",
                    json={
                        "walletAddress": msg.wallet_address,
                        "operationName": msg.operation_name,
                        "tradingParams": msg.operation_params
                    }
                )
            elif msg.task_type == "stake":
                response = await client.post(
                    f"{BACKEND_URL}/api/brewit/operations/staking",
                    json={
                        "walletAddress": msg.wallet_address,
                        "operationName": msg.operation_name,
                        "stakingParams": msg.operation_params
                    }
                )
            else:
                # Generic AI agent operation
                response = await client.post(
                    f"{BACKEND_URL}/api/brewit/operations/ai-agent",
                    json={
                        "walletAddress": msg.wallet_address,
                        "operation": {
                            "name": msg.operation_name,
                            "repeat": msg.operation_params.get("repeatInterval", 5000),
                            "times": msg.operation_params.get("maxExecutions", 1),
                            "task": msg.task_type,
                            "payload": msg.operation_params.get("payload", {})
                        }
                    }
                )
            
            if response.status_code == 200:
                operation_data = response.json()
                operation_id = operation_data["operation"]["id"]
                
                # Generate AI response
                ai_response = await gemini_client.generate_agent_response(
                    f"Created automated {msg.task_type} operation for delegated wallet",
                    "wallet-agent",
                    {"operation_name": msg.operation_name, "task_type": msg.task_type, "operation_id": operation_id}
                )
                
                await ctx.send(
                    sender,
                    AutomatedOperationResponse(
                        success=True,
                        operation_id=operation_id,
                        message=f"Automated operation created successfully. {ai_response}",
                        request_id=msg.request_id
                    )
                )
            else:
                await ctx.send(
                    sender,
                    AutomatedOperationResponse(
                        success=False,
                        message=f"Failed to create automated operation: {response.text}",
                        request_id=msg.request_id
                    )
                )
                
    except Exception as e:
        ctx.logger.error(f"Error creating automated operation: {e}")
        await ctx.send(
            sender,
            AutomatedOperationResponse(
                success=False,
                message=f"Error creating automated operation: {str(e)}",
                request_id=msg.request_id
            )
        )

@wallet_agent.on_message(model=PaymentRequest)
async def handle_payment_request(ctx: Context, sender: str, msg: PaymentRequest):
    """Handle payment requests with x402 validation"""
    ctx.logger.info(f"Received payment request: {msg.amount} {msg.currency} to {msg.to_address}")
    
    try:
        # Check transaction limits using MeTTa rules
        amount_float = float(msg.amount)
        
        # Apply security rules
        if amount_float > WALLET_RULES["security_rules"]["require_identity_verification"]:
            identity_verified = await check_identity_verification(msg.user_address)
            if not identity_verified:
                await ctx.send(
                    sender,
                    PaymentResponse(
                        success=False,
                        message="Identity verification required for this amount. Please verify your identity first.",
                        request_id=msg.request_id
                    )
                )
                return
        
        # Check daily limits
        daily_volume = await get_daily_volume(msg.user_address)
        if daily_volume + amount_float > WALLET_RULES["transaction_limits"]["max_daily"]:
            await ctx.send(
                sender,
                PaymentResponse(
                    success=False,
                    message="Daily transaction limit exceeded. Please try again tomorrow.",
                    request_id=msg.request_id
                )
            )
            return
        
        # Process payment through backend
        payment_result = await process_payment(
            msg.user_address,
            msg.to_address,
            msg.amount,
            msg.currency
        )
        
        if payment_result["success"]:
            await ctx.send(
                sender,
                PaymentResponse(
                    success=True,
                    transaction_hash=payment_result.get("transaction_hash"),
                    message="Payment processed successfully!",
                    request_id=msg.request_id
                )
            )
        else:
            await ctx.send(
                sender,
                PaymentResponse(
                    success=False,
                    message=payment_result.get("error", "Payment failed"),
                    request_id=msg.request_id
                )
            )
            
    except Exception as e:
        ctx.logger.error(f"Error handling payment request: {e}")
        await ctx.send(
            sender,
            PaymentResponse(
                success=False,
                message=f"Error processing payment: {str(e)}",
                request_id=msg.request_id
            )
        )

async def get_wallet_balance(address: str, currency: str = "MATIC") -> Dict[str, Any]:
    """Get wallet balance from backend"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{BACKEND_URL}/api/payments/balance/{address}",
            params={"token": currency if currency != "MATIC" else None}
        )
        if response.status_code == 200:
            data = response.json()
            return {
                "success": True,
                "message": f"Balance retrieved successfully",
                "data": data
            }
        else:
            return {
                "success": False,
                "message": "Failed to retrieve balance",
                "data": None
            }

async def get_transaction_history(address: str, params: Dict[str, Any]) -> Dict[str, Any]:
    """Get transaction history from backend"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{BACKEND_URL}/api/payments/history/{address}",
            params=params
        )
        if response.status_code == 200:
            data = response.json()
            return {
                "success": True,
                "message": "Transaction history retrieved successfully",
                "data": data
            }
        else:
            return {
                "success": False,
                "message": "Failed to retrieve transaction history",
                "data": None
            }

async def check_transaction_limits(address: str, params: Dict[str, Any]) -> Dict[str, Any]:
    """Check transaction limits using MeTTa rules"""
    amount = float(params.get("amount", 0))
    
    # Check single transaction limit
    if amount > WALLET_RULES["transaction_limits"]["max_single"]:
        return {
            "success": False,
            "message": f"Transaction amount exceeds single transaction limit of {WALLET_RULES['transaction_limits']['max_single']}",
            "data": {"limit_exceeded": True, "max_single": WALLET_RULES["transaction_limits"]["max_single"]}
        }
    
    # Check daily volume
    daily_volume = await get_daily_volume(address)
    if daily_volume + amount > WALLET_RULES["transaction_limits"]["max_daily"]:
        return {
            "success": False,
            "message": f"Transaction would exceed daily limit. Remaining: {WALLET_RULES['transaction_limits']['max_daily'] - daily_volume}",
            "data": {"limit_exceeded": True, "daily_remaining": WALLET_RULES["transaction_limits"]["max_daily"] - daily_volume}
        }
    
    return {
        "success": True,
        "message": "Transaction within limits",
        "data": {"within_limits": True, "daily_remaining": WALLET_RULES["transaction_limits"]["max_daily"] - daily_volume}
    }

async def get_security_status(address: str) -> Dict[str, Any]:
    """Get security status including identity verification"""
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BACKEND_URL}/api/identity/proofs/{address}")
        if response.status_code == 200:
            data = response.json()
            verified_proofs = [p for p in data.get("proofs", []) if p["verified"]]
            return {
                "success": True,
                "message": "Security status retrieved",
                "data": {
                    "identity_verified": len(verified_proofs) > 0,
                    "verified_proofs": verified_proofs,
                    "security_level": "high" if len(verified_proofs) >= 2 else "medium" if len(verified_proofs) == 1 else "low"
                }
            }
        else:
            return {
                "success": False,
                "message": "Failed to retrieve security status",
                "data": None
            }

async def check_identity_verification(address: str) -> bool:
    """Check if user has required identity verification"""
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BACKEND_URL}/api/identity/check/{address}")
        if response.status_code == 200:
            data = response.json()
            return data.get("hasRequiredProof", False)
        return False

async def get_daily_volume(address: str) -> float:
    """Get today's transaction volume for the user"""
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BACKEND_URL}/api/payments/analytics/{address}")
        if response.status_code == 200:
            data = response.json()
            return data.get("totalVolume", 0.0)
        return 0.0

async def process_payment(from_address: str, to_address: str, amount: str, currency: str) -> Dict[str, Any]:
    """Process payment through backend with x402 validation"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{BACKEND_URL}/api/payments/send",
            json={
                "from": from_address,
                "to": to_address,
                "amount": amount,
                "currency": currency
            }
        )
        if response.status_code == 200:
            return response.json()
        else:
            return {
                "success": False,
                "error": f"Payment failed: {response.text}"
            }

if __name__ == "__main__":
    print(f"Starting Wallet Agent: {WALLET_AGENT_ID}")
    print(f"Agent address: {wallet_agent.address}")
    print(f"Backend URL: {BACKEND_URL}")
    wallet_agent.run()
