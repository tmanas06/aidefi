#!/usr/bin/env python3
"""
Identity Agent for EthGlobal dApp
Handles Self Protocol identity verification and zk-proof management
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
IDENTITY_AGENT_ID = os.getenv("IDENTITY_AGENT_ID", "identity_agent_001")
IDENTITY_AGENT_SECRET = os.getenv("IDENTITY_AGENT_SECRET", "identity_secret_key")
AGENTVERSE_URL = os.getenv("ASI_AGENTVERSE_URL", "https://agentverse.asi.one")
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:3001")

# Create the identity agent
identity_agent = Agent(
    name="Identity Agent",
    seed=IDENTITY_AGENT_SECRET,
    port=8003,
    endpoint=[f"http://localhost:8003/submit"],
)

# Message models
class IdentityVerificationRequest(Model):
    user_address: str
    proof_type: str  # "age", "country", "sanction"
    required_value: Optional[Any] = None
    request_id: str

class IdentityVerificationResponse(Model):
    success: bool
    message: str
    verification_url: Optional[str] = None
    session_id: Optional[str] = None
    request_id: str

class ProofStatusRequest(Model):
    user_address: str
    proof_id: str
    request_id: str

class ProofStatusResponse(Model):
    success: bool
    verified: bool
    proof_data: Optional[Dict[str, Any]] = None
    message: str
    request_id: str

class IdentityStatusRequest(Model):
    user_address: str
    request_id: str

class IdentityStatusResponse(Model):
    success: bool
    verification_level: str
    proofs: Dict[str, Any]
    message: str
    request_id: str

# MeTTa rules for identity verification
IDENTITY_RULES = {
    "age_verification": {
        "min_age": 18,
        "max_age": 120,
        "required_for": ["high_value_transactions", "subscription_services"]
    },
    "country_verification": {
        "restricted_countries": ["IR", "KP", "SY"],  # Example restricted countries
        "required_for": ["international_transfers", "compliance"]
    },
    "sanction_verification": {
        "required_for": ["all_transactions"],
        "check_frequency": "daily"
    },
    "verification_levels": {
        "basic": 1,      # Email verification
        "enhanced": 2,   # Phone + ID
        "premium": 3,    # Full KYC
        "enterprise": 4  # Corporate verification
    }
}

@identity_agent.on_message(model=IdentityVerificationRequest)
async def handle_identity_verification(ctx: Context, sender: str, msg: IdentityVerificationRequest):
    """Handle identity verification requests"""
    ctx.logger.info(f"Received identity verification request: {msg.proof_type} for {msg.user_address}")
    
    try:
        # Validate proof type
        if msg.proof_type not in ["age", "country", "sanction"]:
            await ctx.send(
                sender,
                IdentityVerificationResponse(
                    success=False,
                    message=f"Unsupported proof type: {msg.proof_type}",
                    request_id=msg.request_id
                )
            )
            return
        
        # Create verification session
        session_result = await create_verification_session(msg.user_address, msg.proof_type, msg.required_value)
        
        if session_result["success"]:
            # Generate AI insights for verification
            ai_insights = await gemini_client.generate_agent_response(
                f"Identity verification requested for {msg.proof_type}",
                "identity-agent",
                {"user_address": msg.user_address, "proof_type": msg.proof_type}
            )
            
            await ctx.send(
                sender,
                IdentityVerificationResponse(
                    success=True,
                    message=f"Verification session created successfully. AI Insights: {ai_insights}",
                    verification_url=session_result["verification_url"],
                    session_id=session_result["session_id"],
                    request_id=msg.request_id
                )
            )
        else:
            await ctx.send(
                sender,
                IdentityVerificationResponse(
                    success=False,
                    message=f"Failed to create verification session: {session_result['error']}",
                    request_id=msg.request_id
                )
            )
            
    except Exception as e:
        ctx.logger.error(f"Error handling identity verification: {e}")
        await ctx.send(
            sender,
            IdentityVerificationResponse(
                success=False,
                message=f"Error processing verification request: {str(e)}",
                request_id=msg.request_id
            )
        )

@identity_agent.on_message(model=ProofStatusRequest)
async def handle_proof_status(ctx: Context, sender: str, msg: ProofStatusRequest):
    """Handle proof status requests"""
    ctx.logger.info(f"Checking proof status for {msg.proof_id}")
    
    try:
        # Get proof status from backend
        status_result = await get_proof_status(msg.user_address, msg.proof_id)
        
        if status_result["success"]:
            await ctx.send(
                sender,
                ProofStatusResponse(
                    success=True,
                    verified=status_result["verified"],
                    proof_data=status_result.get("proof_data"),
                    message="Proof status retrieved successfully",
                    request_id=msg.request_id
                )
            )
        else:
            await ctx.send(
                sender,
                ProofStatusResponse(
                    success=False,
                    verified=False,
                    message=f"Failed to get proof status: {status_result['error']}",
                    request_id=msg.request_id
                )
            )
            
    except Exception as e:
        ctx.logger.error(f"Error handling proof status: {e}")
        await ctx.send(
            sender,
            ProofStatusResponse(
                success=False,
                verified=False,
                message=f"Error checking proof status: {str(e)}",
                request_id=msg.request_id
            )
        )

@identity_agent.on_message(model=IdentityStatusRequest)
async def handle_identity_status(ctx: Context, sender: str, msg: IdentityStatusRequest):
    """Handle identity status requests"""
    ctx.logger.info(f"Getting identity status for {msg.user_address}")
    
    try:
        # Get user's identity status
        status_result = await get_identity_status(msg.user_address)
        
        if status_result["success"]:
            # Calculate verification level using MeTTa rules
            verification_level = calculate_verification_level(status_result["proofs"])
            
            await ctx.send(
                sender,
                IdentityStatusResponse(
                    success=True,
                    verification_level=verification_level,
                    proofs=status_result["proofs"],
                    message="Identity status retrieved successfully",
                    request_id=msg.request_id
                )
            )
        else:
            await ctx.send(
                sender,
                IdentityStatusResponse(
                    success=False,
                    verification_level="unverified",
                    proofs={},
                    message=f"Failed to get identity status: {status_result['error']}",
                    request_id=msg.request_id
                )
            )
            
    except Exception as e:
        ctx.logger.error(f"Error handling identity status: {e}")
        await ctx.send(
            sender,
            IdentityStatusResponse(
                success=False,
                verification_level="unverified",
                proofs={},
                message=f"Error getting identity status: {str(e)}",
                request_id=msg.request_id
            )
        )

async def create_verification_session(user_address: str, proof_type: str, required_value: Any = None) -> Dict[str, Any]:
    """Create verification session with Self Protocol"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{BACKEND_URL}/api/identity/verify",
                json={
                    "userAddress": user_address,
                    "proofType": proof_type,
                    "requiredValue": required_value
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                return {
                    "success": True,
                    "session_id": data.get("sessionId"),
                    "verification_url": data.get("verificationUrl")
                }
            else:
                return {
                    "success": False,
                    "error": f"Backend error: {response.text}"
                }
                
    except Exception as e:
        return {
            "success": False,
            "error": f"Session creation error: {str(e)}"
        }

async def get_proof_status(user_address: str, proof_id: str) -> Dict[str, Any]:
    """Get proof status from backend"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{BACKEND_URL}/api/identity/status/{proof_id}")
            
            if response.status_code == 200:
                data = response.json()
                return {
                    "success": True,
                    "verified": data.get("verified", False),
                    "proof_data": {
                        "id": data.get("id"),
                        "proofType": data.get("proofType"),
                        "verified": data.get("verified"),
                        "createdAt": data.get("createdAt")
                    }
                }
            else:
                return {
                    "success": False,
                    "error": f"Backend error: {response.text}"
                }
                
    except Exception as e:
        return {
            "success": False,
            "error": f"Proof status error: {str(e)}"
        }

async def get_identity_status(user_address: str) -> Dict[str, Any]:
    """Get user's complete identity status"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{BACKEND_URL}/api/identity/proofs/{user_address}")
            
            if response.status_code == 200:
                data = response.json()
                proofs = data.get("proofs", [])
                
                # Organize proofs by type
                proof_summary = {
                    "age": {"verified": False, "count": 0},
                    "country": {"verified": False, "count": 0},
                    "sanction": {"verified": False, "count": 0},
                    "total": len(proofs)
                }
                
                for proof in proofs:
                    if proof["verified"]:
                        proof_type = proof["proofType"]
                        if proof_type in proof_summary:
                            proof_summary[proof_type]["verified"] = True
                            proof_summary[proof_type]["count"] += 1
                
                return {
                    "success": True,
                    "proofs": proof_summary,
                    "raw_proofs": proofs
                }
            else:
                return {
                    "success": False,
                    "error": f"Backend error: {response.text}"
                }
                
    except Exception as e:
        return {
            "success": False,
            "error": f"Identity status error: {str(e)}"
        }

def calculate_verification_level(proofs: Dict[str, Any]) -> str:
    """Calculate verification level using MeTTa rules"""
    verified_count = sum(1 for proof_type in ["age", "country", "sanction"] 
                        if proofs.get(proof_type, {}).get("verified", False))
    
    if verified_count >= 3:
        return "premium"
    elif verified_count >= 2:
        return "enhanced"
    elif verified_count >= 1:
        return "basic"
    else:
        return "unverified"

async def check_verification_requirements(transaction_amount: float, transaction_type: str) -> Dict[str, Any]:
    """Check what verification is required for a transaction"""
    requirements = []
    
    # Age verification requirements
    if transaction_amount > 100.0 or transaction_type in ["subscription", "recurring"]:
        requirements.append({
            "type": "age",
            "reason": "High value transaction or subscription service",
            "required_value": IDENTITY_RULES["age_verification"]["min_age"]
        })
    
    # Country verification requirements
    if transaction_type in ["international_transfer", "cross_border"]:
        requirements.append({
            "type": "country",
            "reason": "International transaction",
            "required_value": None
        })
    
    # Sanction verification (always required)
    requirements.append({
        "type": "sanction",
        "reason": "Compliance requirement",
        "required_value": None
    })
    
    return {
        "requirements": requirements,
        "total_required": len(requirements)
    }

async def validate_verification_for_transaction(user_address: str, amount: float, transaction_type: str) -> Dict[str, Any]:
    """Validate if user has required verification for a transaction"""
    try:
        # Get user's current verification status
        status_result = await get_identity_status(user_address)
        if not status_result["success"]:
            return {
                "valid": False,
                "reason": "Failed to get verification status"
            }
        
        # Check what verification is required
        requirements = await check_verification_requirements(amount, transaction_type)
        
        # Check if user has all required verifications
        missing_requirements = []
        for req in requirements["requirements"]:
            proof_type = req["type"]
            if not status_result["proofs"].get(proof_type, {}).get("verified", False):
                missing_requirements.append(req)
        
        return {
            "valid": len(missing_requirements) == 0,
            "missing_requirements": missing_requirements,
            "current_level": calculate_verification_level(status_result["proofs"]),
            "required_level": "enhanced" if amount > 100.0 else "basic"
        }
        
    except Exception as e:
        return {
            "valid": False,
            "reason": f"Verification validation error: {str(e)}"
        }

if __name__ == "__main__":
    print(f"Starting Identity Agent: {IDENTITY_AGENT_ID}")
    print(f"Agent address: {identity_agent.address}")
    print(f"Backend URL: {BACKEND_URL}")
    identity_agent.run()
