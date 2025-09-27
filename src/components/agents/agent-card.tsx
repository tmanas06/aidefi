'use client'

import { Agent } from '@/types/chat'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bot, MessageCircle } from 'lucide-react'

interface AgentCardProps {
  agent: Agent
  onStartChat: (agentId: string) => void
  isSelected?: boolean
}

export function AgentCard({ agent, onStartChat, isSelected }: AgentCardProps) {
  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'busy': return 'bg-yellow-500'
      case 'offline': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  const getRoleColor = (role: Agent['role']) => {
    switch (role) {
      case 'customer_service': return 'bg-blue-100 text-blue-800'
      case 'sales': return 'bg-green-100 text-green-800'
      case 'technical': return 'bg-purple-100 text-purple-800'
      case 'general': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div 
      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
      }`}
      onClick={() => onStartChat(agent.id)}
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          <Avatar className="h-12 w-12">
            <AvatarImage src={`/avatars/${agent.id}.jpg`} />
            <AvatarFallback>
              <Bot className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${getStatusColor(agent.status)}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold truncate">{agent.name}</h3>
            <Badge className={getRoleColor(agent.role)}>
              {agent.role.replace('_', ' ')}
            </Badge>
          </div>
          
          {agent.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {agent.description}
            </p>
          )}
          
          <Button 
            size="sm" 
            className="w-full"
            onClick={(e) => {
              e.stopPropagation()
              onStartChat(agent.id)
            }}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Start Chat
          </Button>
        </div>
      </div>
    </div>
  )
}
