'use client'

import { useEffect, useRef } from 'react'
import { wsService } from '@/lib/websocket'
import { Message } from '@/types/chat'

interface UseWebSocketProps {
  userId: string
  onMessageReceived?: (message: Message) => void
  onAgentTyping?: (agentId: string, isTyping: boolean) => void
  onAgentStatusChange?: (agentId: string, status: 'online' | 'offline' | 'busy') => void
  onSessionTransfer?: (sessionId: string, newAgentId: string) => void
  onNotification?: (notification: any) => void
}

export function useWebSocket({
  userId,
  onMessageReceived,
  onAgentTyping,
  onAgentStatusChange,
  onSessionTransfer,
  onNotification
}: UseWebSocketProps) {
  const callbacksRef = useRef({
    onMessageReceived,
    onAgentTyping,
    onAgentStatusChange,
    onSessionTransfer,
    onNotification
  })

  // Update callbacks ref when they change
  useEffect(() => {
    callbacksRef.current = {
      onMessageReceived,
      onAgentTyping,
      onAgentStatusChange,
      onSessionTransfer,
      onNotification
    }
  })

  useEffect(() => {
    // Connect to WebSocket
    wsService.connect(userId)

    // Set up event listeners
    if (onMessageReceived) {
      wsService.onMessageReceived((message) => {
        callbacksRef.current.onMessageReceived?.(message)
      })
    }

    if (onAgentTyping) {
      wsService.onAgentTyping((agentId, isTyping) => {
        callbacksRef.current.onAgentTyping?.(agentId, isTyping)
      })
    }

    if (onAgentStatusChange) {
      wsService.onAgentStatusChange((agentId, status) => {
        callbacksRef.current.onAgentStatusChange?.(agentId, status)
      })
    }

    if (onSessionTransfer) {
      wsService.onSessionTransfer((sessionId, newAgentId) => {
        callbacksRef.current.onSessionTransfer?.(sessionId, newAgentId)
      })
    }

    if (onNotification) {
      wsService.onNotification((notification) => {
        callbacksRef.current.onNotification?.(notification)
      })
    }

    // Cleanup on unmount
    return () => {
      wsService.removeAllListeners()
      wsService.disconnect()
    }
  }, [userId])

  return {
    connected: wsService.connected,
    joinAgentRoom: wsService.joinAgentRoom.bind(wsService),
    leaveAgentRoom: wsService.leaveAgentRoom.bind(wsService),
    sendMessage: wsService.sendMessage.bind(wsService),
    transferSession: wsService.transferSession.bind(wsService)
  }
}
