'use client'

import { useState, useEffect, useCallback } from 'react'
import { fetchAIService, FetchAIAgent } from '@/lib/fetchai-service'
import { Message } from '@/types/chat'

interface UseFetchAIProps {
  onMessageReceived?: (message: Message) => void
  onAgentStatusChange?: (agentId: string, status: 'online' | 'offline' | 'busy') => void
}

export function useFetchAI({
  onMessageReceived,
  onAgentStatusChange
}: UseFetchAIProps) {
  const [agents, setAgents] = useState<FetchAIAgent[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize Fetch.ai service
  const initialize = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      await fetchAIService.initialize()
      const availableAgents = fetchAIService.getAllAgents()
      setAgents(availableAgents)
      setIsInitialized(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize Fetch.ai')
    } finally {
      setLoading(false)
    }
  }, [])

  // Send message to Fetch.ai agent
  const sendMessage = useCallback(async (agentId: string, message: string): Promise<string> => {
    try {
      setError(null)
      const response = await fetchAIService.sendMessage(agentId, message)
      
      // Create message object for the response
      if (onMessageReceived) {
        const agent = agents.find(a => a.id === agentId)
        const responseMessage: Message = {
          id: `msg-${Date.now()}`,
          content: response,
          timestamp: new Date(),
          sender: 'agent',
          agentId: agentId,
          agentName: agent?.name || 'Fetch.ai Agent'
        }
        onMessageReceived(responseMessage)
      }
      
      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message'
      setError(errorMessage)
      throw err
    }
  }, [agents, onMessageReceived])

  // Connect to agent
  const connectToAgent = useCallback(async (agentId: string) => {
    try {
      setError(null)
      await fetchAIService.connectToAgent(agentId)
      fetchAIService.updateAgentStatus(agentId, 'online')
      
      if (onAgentStatusChange) {
        onAgentStatusChange(agentId, 'online')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to agent'
      setError(errorMessage)
      throw err
    }
  }, [onAgentStatusChange])

  // Disconnect from agent
  const disconnectFromAgent = useCallback((agentId: string) => {
    fetchAIService.disconnectFromAgent(agentId)
    fetchAIService.updateAgentStatus(agentId, 'offline')
    
    if (onAgentStatusChange) {
      onAgentStatusChange(agentId, 'offline')
    }
  }, [onAgentStatusChange])

  // Get agents by capability
  const getAgentsByCapability = useCallback((capability: string) => {
    return fetchAIService.getAgentsByCapability(capability)
  }, [])

  // Refresh agents list
  const refreshAgents = useCallback(async () => {
    try {
      setLoading(true)
      const updatedAgents = await fetchAIService.loadAvailableAgents()
      setAgents(updatedAgents)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh agents')
    } finally {
      setLoading(false)
    }
  }, [])

  // Check agent status
  const checkAgentStatus = useCallback(async (agentId: string) => {
    try {
      const status = await fetchAIService.getAgentStatus(agentId)
      fetchAIService.updateAgentStatus(agentId, status)
      
      if (onAgentStatusChange) {
        onAgentStatusChange(agentId, status)
      }
      
      return status
    } catch (err) {
      console.error(`Failed to check status for agent ${agentId}:`, err)
      return 'offline'
    }
  }, [onAgentStatusChange])

  // Initialize on mount
  useEffect(() => {
    initialize()
  }, [initialize])

  // Periodically check agent statuses
  useEffect(() => {
    if (!isInitialized) return

    const interval = setInterval(() => {
      agents.forEach(agent => {
        checkAgentStatus(agent.id)
      })
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [isInitialized, agents, checkAgentStatus])

  return {
    agents,
    isInitialized,
    loading,
    error,
    sendMessage,
    connectToAgent,
    disconnectFromAgent,
    getAgentsByCapability,
    refreshAgents,
    checkAgentStatus
  }
}
