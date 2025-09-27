'use client'

import { FetchAIAgent } from '@/lib/fetchai-service'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Bot, Coins, Zap, Shield } from 'lucide-react'

interface FetchAIAgentCardProps {
  agent: FetchAIAgent
  onStartChat: (agentId: string) => void
  isSelected?: boolean
}

export function FetchAIAgentCard({ agent, onStartChat, isSelected }: FetchAIAgentCardProps) {
  const getStatusColor = (status: FetchAIAgent['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'busy': return 'bg-yellow-500'
      case 'offline': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  const getCapabilityIcon = (capability: string) => {
    switch (capability) {
      case 'customer_service': return <Shield className="h-3 w-3" />
      case 'trading_analysis': return <Zap className="h-3 w-3" />
      case 'defi_protocols': return <Coins className="h-3 w-3" />
      default: return <Bot className="h-3 w-3" />
    }
  }

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
      }`}
      onClick={() => onStartChat(agent.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarImage src={`/avatars/fetch-${agent.id}.jpg`} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600">
                <Bot className="h-6 w-6 text-white" />
              </AvatarFallback>
            </Avatar>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${getStatusColor(agent.status)}`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold truncate">{agent.name}</h3>
              <div className="flex items-center gap-1">
                {agent.price && (
                  <Badge variant="outline" className="text-xs">
                    <Coins className="h-3 w-3 mr-1" />
                    {agent.price} FET
                  </Badge>
                )}
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
                  Fetch.ai
                </Badge>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {agent.description}
            </p>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {agent.capabilities.slice(0, 3).map((capability) => (
                <Badge key={capability} variant="secondary" className="text-xs">
                  {getCapabilityIcon(capability)}
                  <span className="ml-1">{capability.replace('_', ' ')}</span>
                </Badge>
              ))}
              {agent.capabilities.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{agent.capabilities.length - 3} more
                </Badge>
              )}
            </div>
            
            <Button 
              size="sm" 
              className="w-full"
              onClick={(e) => {
                e.stopPropagation()
                onStartChat(agent.id)
              }}
            >
              <Bot className="h-4 w-4 mr-2" />
              Chat with Agent
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
