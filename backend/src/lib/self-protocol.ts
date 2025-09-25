import axios from 'axios'

export interface IdentityProof {
  proofType: 'age' | 'country' | 'sanction'
  proofData: string
  verified: boolean
  timestamp: number
}

export interface VerificationRequest {
  proofType: 'age' | 'country' | 'sanction'
  userAddress: string
  requiredValue?: any // e.g., minimum age, specific country, etc.
}

export interface VerificationResponse {
  success: boolean
  proof?: IdentityProof
  error?: string
}

export class SelfProtocolService {
  private apiKey: string
  private baseUrl: string
  private network: string

  constructor() {
    this.apiKey = process.env.SELF_API_KEY || ''
    this.baseUrl = process.env.SELF_BASE_URL || 'https://api.self.xyz'
    this.network = process.env.SELF_NETWORK || 'celo-testnet'
  }

  async verifyIdentity(request: VerificationRequest): Promise<VerificationResponse> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/verify`,
        {
          ...request,
          network: this.network
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return {
        success: response.data.success,
        proof: response.data.proof,
        error: response.data.error
      }
    } catch (error) {
      console.error('Self Protocol verification error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async getVerificationStatus(proofId: string): Promise<{
    status: 'pending' | 'verified' | 'rejected'
    proof?: IdentityProof
  }> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/status/${proofId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      )

      return {
        status: response.data.status,
        proof: response.data.proof
      }
    } catch (error) {
      console.error('Self Protocol status error:', error)
      return {
        status: 'rejected'
      }
    }
  }

  async createVerificationSession(proofType: string): Promise<{
    sessionId: string
    verificationUrl: string
  }> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/session`,
        {
          proofType,
          network: this.network
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return {
        sessionId: response.data.sessionId,
        verificationUrl: response.data.verificationUrl
      }
    } catch (error) {
      console.error('Self Protocol session error:', error)
      throw new Error('Failed to create verification session')
    }
  }
}

// Mock implementation for development
export class MockSelfProtocolService extends SelfProtocolService {
  async verifyIdentity(request: VerificationRequest): Promise<VerificationResponse> {
    console.log('Mock Self Protocol verification:', request)
    
    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock successful verification
    const proof: IdentityProof = {
      proofType: request.proofType,
      proofData: `mock_proof_${Date.now()}`,
      verified: true,
      timestamp: Date.now()
    }

    return {
      success: true,
      proof
    }
  }

  async getVerificationStatus(proofId: string): Promise<{
    status: 'pending' | 'verified' | 'rejected'
    proof?: IdentityProof
  }> {
    // Mock status - always verified for demo
    return {
      status: 'verified',
      proof: {
        proofType: 'age',
        proofData: `mock_proof_${proofId}`,
        verified: true,
        timestamp: Date.now()
      }
    }
  }

  async createVerificationSession(proofType: string): Promise<{
    sessionId: string
    verificationUrl: string
  }> {
    return {
      sessionId: `mock_session_${Date.now()}`,
      verificationUrl: `https://demo.self.xyz/verify?session=mock_session_${Date.now()}&type=${proofType}`
    }
  }
}

// Export the appropriate service based on environment
export const selfProtocolService = process.env.NODE_ENV === 'production' 
  ? new SelfProtocolService() 
  : new MockSelfProtocolService()
