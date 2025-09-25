#!/usr/bin/env python3
"""
Payment Agent for EthGlobal dApp
Handles x402 payment processing and transaction validation
"""

import asyncio
import os
import json
from typing import Dict, Any, Optional
from uagents import Agent, Context, Model
from uagents.network import Network
from dotenv import load_dotenv
import httpx

# Load environment variables
load_dotenv()

# Agent configuration
PAYMENT_AGENT_ID = os.getenv("PAYMENT_AGENT_ID", "payment_agent_001")
PAYMENT_AGENT_SECRET = os.getenv("PAYMENT_AGENT_SECRET", "payment_secret_key")
AGENTVERSE_URL = os.getenv("ASI_AGENTVERSE_URL", "https://agentverse.asi.one")
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:3001")

# Create the payment agent
payment_agent = Agent(
    name="Payment Agent",
    seed=PAYMENT_AGENT_SECRET,
    port=8002,
    endpoint=[f"http://localhost:8002/submit"],
)

# Message models
class PaymentValidationRequest(Model):
    user_address: str
    to_address: str
    amount: str
    currency: str
    request_id: str
    metadata: Optional[Dict[str, Any]] = None

class PaymentValidationResponse(Model):
    success: bool
    message: str
    validation_data: Optional[Dict[str, Any]] = None
    request_id: str

class X402PaymentRequest(Model):
    user_address: str
    to_address: str
    amount: str
    currency: str
    request_id: str
    x402_data: Optional[Dict[str, Any]] = None

class X402PaymentResponse(Model):
    success: bool
    transaction_hash: Optional[str] = None
    message: str
    request_id: str
    x402_response: Optional[Dict[str, Any]] = None

# MeTTa rules for payment processing
PAYMENT_RULES = {
    "x402_validation": {
        "required_fields": ["to", "amount", "currency"],
        "min_amount": 0.000001,  # Minimum payment amount
        "max_amount": 10000.0,   # Maximum payment amount
        "supported_currencies": ["MATIC", "USDC", "USDT"]
    },
    "security_checks": {
        "blacklist_check": True,
        "sanction_check": True,
        "fraud_detection": True
    },
    "compliance": {
        "kyc_required_amount": 100.0,  # KYC required for amounts > $100
        "aml_check_amount": 50.0,      # AML check for amounts > $50
        "reporting_threshold": 1000.0  # Reporting threshold
    }
}

@payment_agent.on_message(model=PaymentValidationRequest)
async def handle_payment_validation(ctx: Context, sender: str, msg: PaymentValidationRequest):
    """Handle payment validation requests"""
    ctx.logger.info(f"Received payment validation request: {msg.amount} {msg.currency} to {msg.to_address}")
    
    try:
        # Validate payment using MeTTa rules
        validation_result = await validate_payment(msg)
        
        if validation_result["valid"]:
            # Perform security checks
            security_result = await perform_security_checks(msg)
            
            if security_result["passed"]:
                # Check compliance requirements
                compliance_result = await check_compliance_requirements(msg)
                
                await ctx.send(
                    sender,
                    PaymentValidationResponse(
                        success=True,
                        message="Payment validation successful",
                        validation_data={
                            "validation": validation_result,
                            "security": security_result,
                            "compliance": compliance_result
                        },
                        request_id=msg.request_id
                    )
                )
            else:
                await ctx.send(
                    sender,
                    PaymentValidationResponse(
                        success=False,
                        message=f"Security check failed: {security_result['reason']}",
                        validation_data=security_result,
                        request_id=msg.request_id
                    )
                )
        else:
            await ctx.send(
                sender,
                PaymentValidationResponse(
                    success=False,
                    message=f"Payment validation failed: {validation_result['reason']}",
                    validation_data=validation_result,
                    request_id=msg.request_id
                )
            )
            
    except Exception as e:
        ctx.logger.error(f"Error handling payment validation: {e}")
        await ctx.send(
            sender,
            PaymentValidationResponse(
                success=False,
                message=f"Error during validation: {str(e)}",
                request_id=msg.request_id
            )
        )

@payment_agent.on_message(model=X402PaymentRequest)
async def handle_x402_payment(ctx: Context, sender: str, msg: X402PaymentRequest):
    """Handle x402 payment processing"""
    ctx.logger.info(f"Processing x402 payment: {msg.amount} {msg.currency}")
    
    try:
        # First validate the payment
        validation_result = await validate_payment(msg)
        if not validation_result["valid"]:
            await ctx.send(
                sender,
                X402PaymentResponse(
                    success=False,
                    message=f"Payment validation failed: {validation_result['reason']}",
                    request_id=msg.request_id
                )
            )
            return
        
        # Process x402 payment
        x402_result = await process_x402_payment(msg)
        
        if x402_result["success"]:
            # Update transaction in backend
            backend_result = await update_transaction_status(
                msg.request_id,
                x402_result["transaction_hash"],
                "completed"
            )
            
            await ctx.send(
                sender,
                X402PaymentResponse(
                    success=True,
                    transaction_hash=x402_result["transaction_hash"],
                    message="x402 payment processed successfully",
                    x402_response=x402_result,
                    request_id=msg.request_id
                )
            )
        else:
            await ctx.send(
                sender,
                X402PaymentResponse(
                    success=False,
                    message=f"x402 payment failed: {x402_result['error']}",
                    x402_response=x402_result,
                    request_id=msg.request_id
                )
            )
            
    except Exception as e:
        ctx.logger.error(f"Error handling x402 payment: {e}")
        await ctx.send(
            sender,
            X402PaymentResponse(
                success=False,
                message=f"Error processing x402 payment: {str(e)}",
                request_id=msg.request_id
            )
        )

async def validate_payment(msg: PaymentValidationRequest) -> Dict[str, Any]:
    """Validate payment using MeTTa rules"""
    try:
        amount = float(msg.amount)
        
        # Check required fields
        if not msg.to_address or not msg.amount or not msg.currency:
            return {
                "valid": False,
                "reason": "Missing required fields"
            }
        
        # Check amount limits
        if amount < PAYMENT_RULES["x402_validation"]["min_amount"]:
            return {
                "valid": False,
                "reason": f"Amount below minimum: {PAYMENT_RULES['x402_validation']['min_amount']}"
            }
        
        if amount > PAYMENT_RULES["x402_validation"]["max_amount"]:
            return {
                "valid": False,
                "reason": f"Amount exceeds maximum: {PAYMENT_RULES['x402_validation']['max_amount']}"
            }
        
        # Check supported currency
        if msg.currency not in PAYMENT_RULES["x402_validation"]["supported_currencies"]:
            return {
                "valid": False,
                "reason": f"Unsupported currency: {msg.currency}"
            }
        
        # Check address format (basic validation)
        if not msg.to_address.startswith("0x") or len(msg.to_address) != 42:
            return {
                "valid": False,
                "reason": "Invalid recipient address format"
            }
        
        return {
            "valid": True,
            "amount": amount,
            "currency": msg.currency,
            "recipient": msg.to_address
        }
        
    except ValueError:
        return {
            "valid": False,
            "reason": "Invalid amount format"
        }

async def perform_security_checks(msg: PaymentValidationRequest) -> Dict[str, Any]:
    """Perform security checks on payment"""
    try:
        # Check if recipient is blacklisted
        blacklist_result = await check_blacklist(msg.to_address)
        if not blacklist_result["allowed"]:
            return {
                "passed": False,
                "reason": f"Recipient is blacklisted: {blacklist_result['reason']}"
            }
        
        # Check for sanction compliance
        sanction_result = await check_sanctions(msg.user_address, msg.to_address)
        if not sanction_result["compliant"]:
            return {
                "passed": False,
                "reason": f"Sanction check failed: {sanction_result['reason']}"
            }
        
        # Fraud detection
        fraud_result = await detect_fraud(msg)
        if not fraud_result["safe"]:
            return {
                "passed": False,
                "reason": f"Fraud detected: {fraud_result['reason']}"
            }
        
        return {
            "passed": True,
            "blacklist_check": blacklist_result,
            "sanction_check": sanction_result,
            "fraud_detection": fraud_result
        }
        
    except Exception as e:
        return {
            "passed": False,
            "reason": f"Security check error: {str(e)}"
        }

async def check_compliance_requirements(msg: PaymentValidationRequest) -> Dict[str, Any]:
    """Check compliance requirements"""
    try:
        amount = float(msg.amount)
        requirements = []
        
        # KYC requirement
        if amount >= PAYMENT_RULES["compliance"]["kyc_required_amount"]:
            kyc_status = await check_kyc_status(msg.user_address)
            if not kyc_status["verified"]:
                requirements.append("KYC verification required")
        
        # AML check
        if amount >= PAYMENT_RULES["compliance"]["aml_check_amount"]:
            aml_status = await perform_aml_check(msg)
            if not aml_status["passed"]:
                requirements.append("AML check required")
        
        # Reporting threshold
        if amount >= PAYMENT_RULES["compliance"]["reporting_threshold"]:
            requirements.append("Transaction reporting required")
        
        return {
            "compliant": len(requirements) == 0,
            "requirements": requirements,
            "amount": amount,
            "thresholds": PAYMENT_RULES["compliance"]
        }
        
    except Exception as e:
        return {
            "compliant": False,
            "requirements": [f"Compliance check error: {str(e)}"],
            "error": str(e)
        }

async def process_x402_payment(msg: X402PaymentRequest) -> Dict[str, Any]:
    """Process payment through x402 protocol"""
    try:
        # Prepare x402 request
        x402_request = {
            "requestId": msg.request_id,
            "to": msg.to_address,
            "amount": msg.amount,
            "currency": msg.currency,
            "data": json.dumps(msg.x402_data or {}),
            "timestamp": int(asyncio.get_event_loop().time() * 1000)
        }
        
        # Send to backend for x402 processing
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{BACKEND_URL}/api/payments/send",
                json={
                    "from": msg.user_address,
                    "to": msg.to_address,
                    "amount": msg.amount,
                    "currency": msg.currency,
                    "x402_data": x402_request
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                return {
                    "success": data.get("success", False),
                    "transaction_hash": data.get("hash"),
                    "x402_data": x402_request
                }
            else:
                return {
                    "success": False,
                    "error": f"Backend error: {response.text}"
                }
                
    except Exception as e:
        return {
            "success": False,
            "error": f"x402 processing error: {str(e)}"
        }

# Security check implementations (mock for demo)
async def check_blacklist(address: str) -> Dict[str, Any]:
    """Check if address is blacklisted"""
    # Mock implementation - in production, this would check against a real blacklist
    blacklisted_addresses = ["0x0000000000000000000000000000000000000000"]
    return {
        "allowed": address not in blacklisted_addresses,
        "reason": "Address is blacklisted" if address in blacklisted_addresses else None
    }

async def check_sanctions(from_address: str, to_address: str) -> Dict[str, Any]:
    """Check sanctions compliance"""
    # Mock implementation - in production, this would check against sanctions lists
    return {
        "compliant": True,
        "reason": None
    }

async def detect_fraud(msg: PaymentValidationRequest) -> Dict[str, Any]:
    """Detect potential fraud"""
    # Mock implementation - in production, this would use ML models
    amount = float(msg.amount)
    
    # Simple fraud detection rules
    if amount > 1000.0 and msg.currency == "MATIC":
        return {
            "safe": False,
            "reason": "Suspiciously high MATIC amount"
        }
    
    return {
        "safe": True,
        "reason": None
    }

async def check_kyc_status(address: str) -> Dict[str, Any]:
    """Check KYC verification status"""
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BACKEND_URL}/api/identity/check/{address}")
        if response.status_code == 200:
            data = response.json()
            return {"verified": data.get("hasRequiredProof", False)}
        return {"verified": False}

async def perform_aml_check(msg: PaymentValidationRequest) -> Dict[str, Any]:
    """Perform AML (Anti-Money Laundering) check"""
    # Mock implementation
    return {
        "passed": True,
        "risk_score": 0.1,
        "reason": None
    }

async def update_transaction_status(request_id: str, tx_hash: str, status: str) -> Dict[str, Any]:
    """Update transaction status in backend"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.put(
                f"{BACKEND_URL}/api/payments/status/{request_id}",
                json={
                    "hash": tx_hash,
                    "status": status
                }
            )
            return {"success": response.status_code == 200}
    except Exception as e:
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    print(f"Starting Payment Agent: {PAYMENT_AGENT_ID}")
    print(f"Agent address: {payment_agent.address}")
    print(f"Backend URL: {BACKEND_URL}")
    payment_agent.run()
