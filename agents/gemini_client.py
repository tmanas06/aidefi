#!/usr/bin/env python3
"""
Gemini AI Client for EthGlobal dApp Agents
Provides AI-powered responses using Google's Gemini API
"""

import os
import asyncio
import json
from typing import Dict, Any, Optional, List
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class GeminiClient:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-pro')
            self.enabled = True
        else:
            self.enabled = False
            print("Warning: GEMINI_API_KEY not found. Using mock responses.")

    async def generate_response(self, prompt: str, context: Optional[Dict[str, Any]] = None) -> str:
        """Generate a response using Gemini AI"""
        if not self.enabled:
            return await self._mock_response(prompt, context)
        
        try:
            # Prepare the full prompt with context
            full_prompt = self._build_prompt(prompt, context)
            
            # Generate response
            response = self.model.generate_content(full_prompt)
            return response.text
        except Exception as e:
            print(f"Gemini API error: {e}")
            return await self._mock_response(prompt, context)

    async def analyze_transaction(self, transaction_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze transaction data for risk and compliance"""
        if not self.enabled:
            return await self._mock_transaction_analysis(transaction_data)
        
        try:
            prompt = f"""
            Analyze this DeFi transaction for risk and compliance:
            
            Transaction Details:
            - Amount: {transaction_data.get('amount', 'Unknown')}
            - Currency: {transaction_data.get('currency', 'Unknown')}
            - From: {transaction_data.get('from', 'Unknown')}
            - To: {transaction_data.get('to', 'Unknown')}
            - Timestamp: {transaction_data.get('timestamp', 'Unknown')}
            
            Please provide a JSON response with:
            1. risk_level (low/medium/high)
            2. compliance_status (compliant/non_compliant/requires_review)
            3. recommendations (list of strings)
            4. concerns (list of strings)
            
            Respond only with valid JSON.
            """
            
            response = self.model.generate_content(prompt)
            analysis = json.loads(response.text)
            return analysis
        except Exception as e:
            print(f"Gemini transaction analysis error: {e}")
            return await self._mock_transaction_analysis(transaction_data)

    async def analyze_identity(self, identity_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze identity verification data"""
        if not self.enabled:
            return await self._mock_identity_analysis(identity_data)
        
        try:
            prompt = f"""
            Analyze this identity verification data:
            
            Verification Details:
            - Proof Types: {identity_data.get('proof_types', [])}
            - Verification Level: {identity_data.get('verification_level', 'Unknown')}
            - Risk Score: {identity_data.get('risk_score', 'Unknown')}
            - Compliance Status: {identity_data.get('compliance_status', 'Unknown')}
            
            Please provide a JSON response with:
            1. verification_confidence (0-100)
            2. additional_requirements (list of strings)
            3. security_recommendations (list of strings)
            4. compliance_notes (string)
            
            Respond only with valid JSON.
            """
            
            response = self.model.generate_content(prompt)
            analysis = json.loads(response.text)
            return analysis
        except Exception as e:
            print(f"Gemini identity analysis error: {e}")
            return await self._mock_identity_analysis(identity_data)

    async def generate_agent_response(self, user_message: str, agent_type: str, context: Optional[Dict[str, Any]] = None) -> str:
        """Generate agent-specific responses"""
        if not self.enabled:
            return await self._mock_agent_response(user_message, agent_type)
        
        try:
            system_prompts = {
                'wallet-agent': """
                You are a helpful wallet agent for a DeFi application. 
                You help users with wallet operations, balance inquiries, and transaction management.
                Be professional, concise, and security-focused.
                """,
                'payment-agent': """
                You are a payment processing agent for a DeFi application.
                You help with payment validation, x402 processing, and transaction security.
                Be thorough, security-focused, and compliance-oriented.
                """,
                'identity-agent': """
                You are an identity verification agent for a DeFi application.
                You help with KYC, compliance, and zk-proof verification.
                Be privacy-focused, compliant, and helpful.
                """
            }
            
            system_prompt = system_prompts.get(agent_type, "You are a helpful AI assistant for a DeFi application.")
            
            prompt = f"""
            {system_prompt}
            
            Context: {json.dumps(context or {})}
            
            User Message: {user_message}
            
            Please provide a helpful response:
            """
            
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            print(f"Gemini agent response error: {e}")
            return await self._mock_agent_response(user_message, agent_type)

    def _build_prompt(self, prompt: str, context: Optional[Dict[str, Any]]) -> str:
        """Build the full prompt with context"""
        if context:
            context_str = json.dumps(context, indent=2)
            return f"Context: {context_str}\n\nUser Request: {prompt}"
        return prompt

    async def _mock_response(self, prompt: str, context: Optional[Dict[str, Any]]) -> str:
        """Mock response when Gemini is not available"""
        return f"Mock Gemini response to: '{prompt}'. This is a demo response from Gemini integration."

    async def _mock_transaction_analysis(self, transaction_data: Dict[str, Any]) -> Dict[str, Any]:
        """Mock transaction analysis"""
        amount = float(transaction_data.get('amount', 0))
        
        if amount > 1000:
            risk_level = "high"
            compliance_status = "requires_review"
        elif amount > 100:
            risk_level = "medium"
            compliance_status = "compliant"
        else:
            risk_level = "low"
            compliance_status = "compliant"
        
        return {
            "risk_level": risk_level,
            "compliance_status": compliance_status,
            "recommendations": [
                "Monitor transaction patterns",
                "Verify recipient address",
                "Check compliance requirements"
            ],
            "concerns": [] if risk_level == "low" else ["High value transaction"]
        }

    async def _mock_identity_analysis(self, identity_data: Dict[str, Any]) -> Dict[str, Any]:
        """Mock identity analysis"""
        verification_level = identity_data.get('verification_level', 'basic')
        
        confidence_map = {
            'basic': 70,
            'enhanced': 85,
            'premium': 95,
            'enterprise': 99
        }
        
        return {
            "verification_confidence": confidence_map.get(verification_level, 70),
            "additional_requirements": [],
            "security_recommendations": [
                "Regular verification updates",
                "Monitor for changes in status"
            ],
            "compliance_notes": f"Verification level {verification_level} is appropriate for current requirements"
        }

    async def _mock_agent_response(self, user_message: str, agent_type: str) -> str:
        """Mock agent responses"""
        responses = {
            'wallet-agent': 'I can help you with your wallet operations. What would you like to do?',
            'payment-agent': 'I\'m processing your payment request. Please confirm the details.',
            'identity-agent': 'I can assist with identity verification. Let me help you with that.'
        }
        
        return responses.get(agent_type, 'How can I help you today?')

# Global instance
gemini_client = GeminiClient()
