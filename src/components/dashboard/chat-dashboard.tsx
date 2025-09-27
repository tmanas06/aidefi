'use client'

import { useState, useEffect } from 'react'
import { Agent, ChatSession, Message } from '@/types/chat'
import { AgentList } from '@/components/agents/agent-list'
import { ChatInterface } from '@/components/chat/chat-interface'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus } from 'lucide-react'
import { useWebSocket } from '@/hooks/useWebSocket'

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

  // WebSocket integration
  const { connected, joinAgentRoom, leaveAgentRoom, sendMessage: wsSendMessage } = useWebSocket({
    userId: 'user-123', // In real app, get from auth
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

  const handleStartChat = (agentId: string) => {
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

  const handleSendMessage = (content: string) => {
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

  const handleEndSession = () => {
    if (currentSession && connected) {
      leaveAgentRoom(currentSession.agentId)
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

  return (
    <div className="flex h-full">
      {showAgentList ? (
        <div className="flex-1 flex">
          <div className="w-96 border-r">
            <AgentList
              agents={agents}
              onStartChat={handleStartChat}
              selectedAgentId={selectedAgentId}
            />
          </div>
          <div className="flex-1 flex items-center justify-center bg-muted/50">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Select an Agent</h3>
              <p className="text-muted-foreground mb-4">
                Choose an available agent to start a conversation
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
          <div className="p-4 border-b bg-background">
            <Button variant="ghost" onClick={handleBackToAgents}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Agents
            </Button>
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
