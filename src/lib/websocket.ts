import { io, Socket } from 'socket.io-client'
import { Message, ChatSession } from '@/types/chat'

export class WebSocketService {
  private socket: Socket | null = null
  private isConnected = false

  connect(userId: string) {
    if (this.socket?.connected) return

    this.socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001', {
      auth: { userId },
      transports: ['websocket', 'polling']
    })

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server')
      this.isConnected = true
    })

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server')
      this.isConnected = false
    })

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error)
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.isConnected = false
    }
  }

  // Agent communication methods
  joinAgentRoom(agentId: string) {
    if (this.socket) {
      this.socket.emit('join_agent_room', agentId)
    }
  }

  leaveAgentRoom(agentId: string) {
    if (this.socket) {
      this.socket.emit('leave_agent_room', agentId)
    }
  }

  sendMessage(sessionId: string, message: string, recipientAgentId: string) {
    if (this.socket) {
      this.socket.emit('send_message', {
        sessionId,
        message,
        recipientAgentId,
        timestamp: new Date()
      })
    }
  }

  // Event listeners
  onMessageReceived(callback: (message: Message) => void) {
    if (this.socket) {
      this.socket.on('message_received', callback)
    }
  }

  onAgentTyping(callback: (agentId: string, isTyping: boolean) => void) {
    if (this.socket) {
      this.socket.on('agent_typing', callback)
    }
  }

  onAgentStatusChange(callback: (agentId: string, status: 'online' | 'offline' | 'busy') => void) {
    if (this.socket) {
      this.socket.on('agent_status_change', callback)
    }
  }

  onSessionTransfer(callback: (sessionId: string, newAgentId: string) => void) {
    if (this.socket) {
      this.socket.on('session_transfer', callback)
    }
  }

  // Agent-to-agent communication
  transferSession(sessionId: string, fromAgentId: string, toAgentId: string) {
    if (this.socket) {
      this.socket.emit('transfer_session', {
        sessionId,
        fromAgentId,
        toAgentId
      })
    }
  }

  // Notifications
  onNotification(callback: (notification: any) => void) {
    if (this.socket) {
      this.socket.on('notification', callback)
    }
  }

  // Remove listeners
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners()
    }
  }

  get connected() {
    return this.isConnected && this.socket?.connected
  }
}

// Singleton instance
export const wsService = new WebSocketService()
