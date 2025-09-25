import axios from 'axios'

export interface X402Request {
  requestId: string
  to: string
  amount: string
  currency: string
  data?: string
  timestamp: number
}

export interface X402Response {
  success: boolean
  transactionHash?: string
  error?: string
}

export class X402Service {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.X402_API_KEY || ''
    this.baseUrl = process.env.X402_BASE_URL || 'https://api.x402.org'
  }

  async validateRequest(request: X402Request): Promise<boolean> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/validate`,
        request,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )
      return response.data.valid
    } catch (error) {
      console.error('X402 validation error:', error)
      return false
    }
  }

  async processPayment(request: X402Request): Promise<X402Response> {
    try {
      // First validate the request
      const isValid = await this.validateRequest(request)
      if (!isValid) {
        return {
          success: false,
          error: 'Invalid request'
        }
      }

      // Process the payment
      const response = await axios.post(
        `${this.baseUrl}/pay`,
        request,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return {
        success: response.data.success,
        transactionHash: response.data.transactionHash,
        error: response.data.error
      }
    } catch (error) {
      console.error('X402 payment error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async getPaymentStatus(requestId: string): Promise<{
    status: 'pending' | 'completed' | 'failed'
    transactionHash?: string
  }> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/status/${requestId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      )

      return {
        status: response.data.status,
        transactionHash: response.data.transactionHash
      }
    } catch (error) {
      console.error('X402 status error:', error)
      return {
        status: 'failed'
      }
    }
  }
}

// Mock implementation for development
export class MockX402Service extends X402Service {
  async validateRequest(request: X402Request): Promise<boolean> {
    // Mock validation - always returns true for demo
    console.log('Mock X402 validation:', request)
    return true
  }

  async processPayment(request: X402Request): Promise<X402Response> {
    // Mock payment processing
    console.log('Mock X402 payment:', request)
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return {
      success: true,
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`
    }
  }

  async getPaymentStatus(requestId: string): Promise<{
    status: 'pending' | 'completed' | 'failed'
    transactionHash?: string
  }> {
    // Mock status - always completed for demo
    return {
      status: 'completed',
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`
    }
  }
}

// Export the appropriate service based on environment
export const x402Service = process.env.NODE_ENV === 'production' 
  ? new X402Service() 
  : new MockX402Service()
