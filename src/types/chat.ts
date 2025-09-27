export interface Message {
  id: string
  content: string
  timestamp: Date
  sender: 'user' | 'agent' | 'system'
  agentId?: string
  agentName?: string
  isTyping?: boolean
}

export interface Agent {
  id: string
  name: string
  avatar?: string
  status: 'online' | 'offline' | 'busy'
  role: 'customer_service' | 'sales' | 'technical' | 'general'
  description?: string
}

export interface ChatSession {
  id: string
  agentId: string
  agentName: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  status: 'active' | 'ended' | 'transferred'
}
