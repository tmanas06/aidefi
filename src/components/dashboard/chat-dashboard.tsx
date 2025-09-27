'use client'

import { useState, useEffect } from 'react'
import { Agent, ChatSession, Message } from '@/types/chat'
import { AgentList } from '@/components/agents/agent-list'
import { ChatInterface } from '@/components/chat/chat-interface'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus, Bot, Zap } from 'lucide-react'
import { useWebSocket } from '@/hooks/useWebSocket'
import { useFetchAI } from '@/hooks/useFetchAI'
import { useAccount } from 'wagmi'
import { WalletConnect } from '@/components/wallet/wallet-connect'
import { FetchAIAgentList } from '@/components/agents/fetchai-agent-list'

interface ChatDashboardProps {
  onStartNewChat: () => void
}

// Mock data for demonstration
const mockAgents: Agent[] = [
  {
    id: 'agent-1',
    name: 'Sarah Johnson',
    status: 'online',
    role: 'customer_service',
    description: 'Specialized in order support and account management'
  },
  {
    id: 'agent-2',
    name: 'Mike Chen',
    status: 'online',
    role: 'technical',
    description: 'Technical support and troubleshooting expert'
  },
  {
    id: 'agent-3',
    name: 'Emily Rodriguez',
    status: 'busy',
    role: 'sales',
    description: 'Product specialist and sales consultant'
  },
  {
    id: 'agent-4',
    name: 'David Kim',
    status: 'online',
    role: 'general',
    description: 'General inquiries and general support'
  }
]

export function ChatDashboard({ onStartNewChat }: ChatDashboardProps) {
  const [agents, setAgents] = useState<Agent[]>(mockAgents)
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
  const [selectedAgentId, setSelectedAgentId] = useState<string | undefined>()
  const [showAgentList, setShowAgentList] = useState(true)
  const [useFetchAIAgents, setUseFetchAIAgents] = useState(false)
  const { address, isConnected } = useAccount()

  // Fetch.ai integration
  const {
    agents: fetchAIAgents,
    isInitialized: fetchAIInitialized,
    loading: fetchAILoading,
    error: fetchAIError,
    sendMessage: fetchAISendMessage,
    connectToAgent: fetchAIConnectToAgent,
    disconnectFromAgent: fetchAIDisconnectFromAgent,
    refreshAgents: refreshFetchAIAgents
  } = useFetchAI({
    onMessageReceived: (message: Message) => {
      setCurrentSession(prev => prev ? {
        ...prev,
        messages: [...prev.messages, message],
        updatedAt: new Date()
      } : null)
    },
    onAgentStatusChange: (agentId: string, status: 'online' | 'offline' | 'busy') => {
      // Update Fetch.ai agent status
      console.log(`Fetch.ai agent ${agentId} status changed to ${status}`)
    }
  })

  // WebSocket integration
  const { connected, joinAgentRoom, leaveAgentRoom, sendMessage: wsSendMessage } = useWebSocket({
    userId: address || 'anonymous', // Use wallet address as user ID
    onMessageReceived: (message: Message) => {
      setCurrentSession(prev => prev ? {
        ...prev,
        messages: [...prev.messages, message],
        updatedAt: new Date()
      } : null)
    },
    onAgentStatusChange: (agentId: string, status: 'online' | 'offline' | 'busy') => {
      setAgents(prev => prev.map(agent => 
        agent.id === agentId ? { ...agent, status } : agent
      ))
    },
    onSessionTransfer: (sessionId: string, newAgentId: string) => {
      const newAgent = agents.find(a => a.id === newAgentId)
      if (newAgent && currentSession?.id === sessionId) {
        setCurrentSession(prev => prev ? {
          ...prev,
          agentId: newAgent.id,
          agentName: newAgent.name
        } : null)
      }
    }
  })

  const handleStartChat = async (agentId: string) => {
    if (useFetchAIAgents) {
      // Handle Fetch.ai agent
      const fetchAIAgent = fetchAIAgents.find(a => a.id === agentId)
      if (!fetchAIAgent) return

      try {
        await fetchAIConnectToAgent(agentId)
        
        const newSession: ChatSession = {
          id: `fetch-session-${Date.now()}`,
          agentId: fetchAIAgent.id,
          agentName: fetchAIAgent.name,
          messages: [
            {
              id: 'msg-1',
              content: `Hello! I'm ${fetchAIAgent.name}, a Fetch.ai autonomous agent. How can I assist you today?`,
              timestamp: new Date(),
              sender: 'agent',
              agentId: fetchAIAgent.id,
              agentName: fetchAIAgent.name
            }
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
          status: 'active'
        }

        setCurrentSession(newSession)
        setSelectedAgentId(agentId)
        setShowAgentList(false)
      } catch (error) {
        console.error('Failed to connect to Fetch.ai agent:', error)
      }
    } else {
      // Handle regular agent
      const agent = agents.find(a => a.id === agentId)
      if (!agent) return

      // Join agent room via WebSocket
      if (connected) {
        joinAgentRoom(agentId)
      }

      const newSession: ChatSession = {
        id: `session-${Date.now()}`,
        agentId: agent.id,
        agentName: agent.name,
        messages: [
          {
            id: 'msg-1',
            content: `Hello! I'm ${agent.name}. How can I help you today?`,
            timestamp: new Date(),
            sender: 'agent',
            agentId: agent.id,
            agentName: agent.name
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active'
      }

      setCurrentSession(newSession)
      setSelectedAgentId(agentId)
      setShowAgentList(false)
    }
  }

  const handleSendMessage = async (content: string) => {
    if (!currentSession) return

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      content,
      timestamp: new Date(),
      sender: 'user'
    }

    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, userMessage],
      updatedAt: new Date()
    }

    setCurrentSession(updatedSession)

    if (useFetchAIAgents) {
      // Send message to Fetch.ai agent
      try {
        await fetchAISendMessage(currentSession.agentId, content)
      } catch (error) {
        console.error('Failed to send message to Fetch.ai agent:', error)
        
        // Fallback response
        const errorResponse: Message = {
          id: `msg-${Date.now() + 1}`,
          content: "I'm sorry, I'm experiencing technical difficulties. Please try again later.",
          timestamp: new Date(),
          sender: 'agent',
          agentId: currentSession.agentId,
          agentName: currentSession.agentName
        }

        setCurrentSession(prev => prev ? {
          ...prev,
          messages: [...prev.messages, errorResponse],
          updatedAt: new Date()
        } : null)
      }
    } else {
      // Send message via WebSocket
      if (connected) {
        wsSendMessage(currentSession.id, content, currentSession.agentId)
      } else {
        // Fallback simulation if WebSocket not connected
        setTimeout(() => {
          const agentResponse: Message = {
            id: `msg-${Date.now() + 1}`,
            content: "Thank you for your message. Let me help you with that. Can you provide more details?",
            timestamp: new Date(),
            sender: 'agent',
            agentId: currentSession.agentId,
            agentName: currentSession.agentName
          }

          setCurrentSession(prev => prev ? {
            ...prev,
            messages: [...prev.messages, agentResponse],
            updatedAt: new Date()
          } : null)
        }, 1000)
      }
    }
  }

  const handleEndSession = () => {
    if (currentSession) {
      if (useFetchAIAgents) {
        fetchAIDisconnectFromAgent(currentSession.agentId)
      } else if (connected) {
        leaveAgentRoom(currentSession.agentId)
      }
    }
    setCurrentSession(null)
    setSelectedAgentId(undefined)
    setShowAgentList(true)
  }

  const handleTransferAgent = () => {
    setShowAgentList(true)
    setCurrentSession(null)
  }

  const handleBackToAgents = () => {
    setShowAgentList(true)
    setCurrentSession(null)
    setSelectedAgentId(undefined)
  }

  // Show wallet connection prompt if not connected
  if (!isConnected) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
            <p className="text-muted-foreground mb-6">
              Connect your wallet to start chatting with AI agents and access blockchain features
            </p>
          </div>
          <WalletConnect />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full">
      {showAgentList ? (
        <div className="flex-1 flex">
          <div className="w-96 border-r flex flex-col">
            {/* Agent Type Toggle */}
            <div className="p-4 border-b">
              <div className="flex gap-2">
                <Button
                  variant={!useFetchAIAgents ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setUseFetchAIAgents(false)}
                  className="flex-1"
                >
                  <Bot className="h-4 w-4 mr-2" />
                  Regular Agents
                </Button>
                <Button
                  variant={useFetchAIAgents ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setUseFetchAIAgents(true)}
                  className="flex-1"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Fetch.ai Agents
                </Button>
              </div>
            </div>
            
            {/* Agent List */}
            <div className="flex-1">
              {useFetchAIAgents ? (
                <FetchAIAgentList
                  agents={fetchAIAgents}
                  onStartChat={handleStartChat}
                  onRefresh={refreshFetchAIAgents}
                  loading={fetchAILoading}
                  selectedAgentId={selectedAgentId}
                />
              ) : (
                <AgentList
                  agents={agents}
                  onStartChat={handleStartChat}
                  selectedAgentId={selectedAgentId}
                />
              )}
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center bg-muted/50">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">
                {useFetchAIAgents ? 'Select a Fetch.ai Agent' : 'Select an Agent'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {useFetchAIAgents 
                  ? 'Choose from autonomous Fetch.ai agents with specialized capabilities'
                  : 'Choose an available agent to start a conversation'
                }
              </p>
              <Button onClick={onStartNewChat}>
                <Plus className="h-4 w-4 mr-2" />
                Start New Chat
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b bg-background flex items-center justify-between">
            <Button variant="ghost" onClick={handleBackToAgents}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Agents
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Connected as: {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>
          </div>
          <ChatInterface
            session={currentSession}
            onSendMessage={handleSendMessage}
            onEndSession={handleEndSession}
            onTransferAgent={handleTransferAgent}
          />
        </div>
      )}
    </div>
  )
}
