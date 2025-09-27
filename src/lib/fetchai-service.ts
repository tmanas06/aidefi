import axios from 'axios'

// Fetch.ai Agent Configuration
export interface FetchAIAgent {
  id: string
  name: string
  description: string
  endpoint: string
  port: number
  capabilities: string[]
  status: 'online' | 'offline' | 'busy'
  price?: number // FET tokens per interaction
}

// Fetch.ai Service Configuration
const FETCHAI_CONFIG = {
  // Agentverse API endpoints
  AGENTVERSE_BASE_URL: 'https://api.agentverse.ai',
  // Local agent endpoints (when running locally)
  LOCAL_AGENT_BASE: 'http://localhost:8001',
  // Fetch.ai network endpoints
  FETCHAI_NETWORK: 'https://api.fetch.ai',
}

export class FetchAIService {
  private agents: FetchAIAgent[] = []
  private connectedAgents: Map<string, WebSocket> = new Map()

  // Initialize Fetch.ai service
  async initialize() {
    try {
      await this.loadAvailableAgents()
      console.log('Fetch.ai service initialized successfully')
    } catch (error) {
      console.error('Failed to initialize Fetch.ai service:', error)
    }
  }

  // Load available agents from Agentverse or local registry
  async loadAvailableAgents(): Promise<FetchAIAgent[]> {
    try {
      // Try to load from Agentverse first
      const response = await axios.get(`${FETCHAI_CONFIG.AGENTVERSE_BASE_URL}/agents`)
      this.agents = response.data.agents || []
    } catch (error) {
      console.warn('Failed to load agents from Agentverse, using local agents')
      // Fallback to local agents
      this.agents = this.getLocalAgents()
    }
    return this.agents
  }

  // Get local agents for development
  private getLocalAgents(): FetchAIAgent[] {
    return [
      {
        id: 'fetch-agent-1',
        name: 'Fetch.ai Customer Service Agent',
        description: 'Specialized in customer support with blockchain knowledge',
        endpoint: '127.0.0.1',
        port: 8001,
        capabilities: ['customer_service', 'blockchain_support', 'defi_advice'],
        status: 'online',
        price: 0.1
      },
      {
        id: 'fetch-agent-2',
        name: 'Fetch.ai Trading Assistant',
        description: 'Provides trading insights and market analysis',
        endpoint: '127.0.0.1',
        port: 8002,
        capabilities: ['trading_analysis', 'market_research', 'portfolio_management'],
        status: 'online',
        price: 0.2
      },
      {
        id: 'fetch-agent-3',
        name: 'Fetch.ai DeFi Expert',
        description: 'Expert in decentralized finance protocols and yield farming',
        endpoint: '127.0.0.1',
        port: 8003,
        capabilities: ['defi_protocols', 'yield_farming', 'liquidity_providing'],
        status: 'online',
        price: 0.15
      },
      {
        id: 'fetch-agent-4',
        name: 'Fetch.ai General Assistant',
        description: 'General purpose AI assistant with Web3 knowledge',
        endpoint: '127.0.0.1',
        port: 8004,
        capabilities: ['general_questions', 'web3_education', 'blockchain_explanation'],
        status: 'online',
        price: 0.05
      }
    ]
  }

  // Connect to a Fetch.ai agent
  async connectToAgent(agentId: string): Promise<WebSocket | null> {
    const agent = this.agents.find(a => a.id === agentId)
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`)
    }

    if (this.connectedAgents.has(agentId)) {
      return this.connectedAgents.get(agentId)!
    }

    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      return null
    }

    try {
      const wsUrl = `ws://${agent.endpoint}:${agent.port}/ws`
      const ws = new WebSocket(wsUrl)
      
      ws.onopen = () => {
        console.log(`Connected to Fetch.ai agent: ${agent.name}`)
      }

      ws.onerror = (error) => {
        console.error(`WebSocket error for agent ${agent.name}:`, error)
      }

      ws.onclose = () => {
        console.log(`Disconnected from Fetch.ai agent: ${agent.name}`)
        this.connectedAgents.delete(agentId)
      }

      this.connectedAgents.set(agentId, ws)
      return ws
    } catch (error) {
      console.error(`Failed to connect to agent ${agent.name}:`, error)
      return null
    }
  }

  // Send message to Fetch.ai agent
  async sendMessage(agentId: string, message: string): Promise<string> {
    const agent = this.agents.find(a => a.id === agentId)
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`)
    }

    // Try WebSocket connection first
    const ws = this.connectedAgents.get(agentId)
    if (ws && ws.readyState === WebSocket.OPEN) {
      return new Promise((resolve, reject) => {
        const messageData = {
          type: 'message',
          content: message,
          timestamp: new Date().toISOString(),
          user_id: 'blockchain_user'
        }

        ws.send(JSON.stringify(messageData))

        // Set up response handler
        const responseHandler = (event: MessageEvent) => {
          try {
            const response = JSON.parse(event.data)
            if (response.type === 'response') {
              ws.removeEventListener('message', responseHandler)
              resolve(response.content)
            }
          } catch (error) {
            reject(error)
          }
        }

        ws.addEventListener('message', responseHandler)

        // Timeout after 30 seconds
        setTimeout(() => {
          ws.removeEventListener('message', responseHandler)
          reject(new Error('Request timeout'))
        }, 30000)
      })
    }

    // Fallback to HTTP API
    try {
      const response = await axios.post(
        `http://${agent.endpoint}:${agent.port}/api/chat`,
        {
          message,
          user_id: 'blockchain_user',
          timestamp: new Date().toISOString()
        }
      )
      return response.data.response
    } catch (error) {
      throw new Error(`Failed to communicate with agent: ${error}`)
    }
  }

  // Get agent capabilities
  getAgentCapabilities(agentId: string): string[] {
    const agent = this.agents.find(a => a.id === agentId)
    return agent?.capabilities || []
  }

  // Get all available agents
  getAllAgents(): FetchAIAgent[] {
    return this.agents
  }

  // Get agents by capability
  getAgentsByCapability(capability: string): FetchAIAgent[] {
    return this.agents.filter(agent => 
      agent.capabilities.includes(capability)
    )
  }

  // Disconnect from agent
  disconnectFromAgent(agentId: string) {
    const ws = this.connectedAgents.get(agentId)
    if (ws) {
      ws.close()
      this.connectedAgents.delete(agentId)
    }
  }

  // Get agent status
  async getAgentStatus(agentId: string): Promise<'online' | 'offline' | 'busy'> {
    const agent = this.agents.find(a => a.id === agentId)
    if (!agent) return 'offline'

    try {
      const response = await axios.get(`http://${agent.endpoint}:${agent.port}/api/status`)
      return response.data.status
    } catch (error) {
      return 'offline'
    }
  }

  // Update agent status
  updateAgentStatus(agentId: string, status: 'online' | 'offline' | 'busy') {
    const agent = this.agents.find(a => a.id === agentId)
    if (agent) {
      agent.status = status
    }
  }
}

// Singleton instance
export const fetchAIService = new FetchAIService()
