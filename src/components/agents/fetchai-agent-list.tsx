'use client'

import { FetchAIAgent } from '@/lib/fetchai-service'
import { FetchAIAgentCard } from './fetchai-agent-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Bot, RefreshCw, ExternalLink } from 'lucide-react'
import { useState } from 'react'

interface FetchAIAgentListProps {
  agents: FetchAIAgent[]
  onStartChat: (agentId: string) => void
  onRefresh: () => void
  loading?: boolean
  selectedAgentId?: string
}

export function FetchAIAgentList({ 
  agents, 
  onStartChat, 
  onRefresh, 
  loading = false,
  selectedAgentId 
}: FetchAIAgentListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCapability, setSelectedCapability] = useState<string | 'all'>('all')

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCapability = selectedCapability === 'all' || 
                             agent.capabilities.includes(selectedCapability)
    
    return matchesSearch && matchesCapability
  })

  const onlineAgents = filteredAgents.filter(agent => agent.status === 'online')
  const busyAgents = filteredAgents.filter(agent => agent.status === 'busy')
  const offlineAgents = filteredAgents.filter(agent => agent.status === 'offline')

  const allCapabilities = Array.from(new Set(agents.flatMap(agent => agent.capabilities)))

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Fetch.ai Agents
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Fetch.ai agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCapability === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCapability('all')}
            >
              All
            </Button>
            {allCapabilities.slice(0, 5).map(capability => (
              <Button
                key={capability}
                variant={selectedCapability === capability ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCapability(capability)}
              >
                {capability.replace('_', ' ')}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {onlineAgents.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-green-600 mb-2">
              Online ({onlineAgents.length})
            </h3>
            <div className="space-y-2">
              {onlineAgents.map(agent => (
                <FetchAIAgentCard
                  key={agent.id}
                  agent={agent}
                  onStartChat={onStartChat}
                  isSelected={selectedAgentId === agent.id}
                />
              ))}
            </div>
          </div>
        )}

        {busyAgents.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-yellow-600 mb-2">
              Busy ({busyAgents.length})
            </h3>
            <div className="space-y-2">
              {busyAgents.map(agent => (
                <FetchAIAgentCard
                  key={agent.id}
                  agent={agent}
                  onStartChat={onStartChat}
                  isSelected={selectedAgentId === agent.id}
                />
              ))}
            </div>
          </div>
        )}

        {offlineAgents.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Offline ({offlineAgents.length})
            </h3>
            <div className="space-y-2">
              {offlineAgents.map(agent => (
                <FetchAIAgentCard
                  key={agent.id}
                  agent={agent}
                  onStartChat={onStartChat}
                  isSelected={selectedAgentId === agent.id}
                />
              ))}
            </div>
          </div>
        )}

        {filteredAgents.length === 0 && !loading && (
          <div className="text-center py-8 text-muted-foreground">
            <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No Fetch.ai agents found matching your criteria</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => {
                setSearchTerm('')
                setSelectedCapability('all')
              }}
            >
              Clear filters
            </Button>
          </div>
        )}

        {loading && (
          <div className="text-center py-8 text-muted-foreground">
            <RefreshCw className="h-8 w-8 mx-auto mb-4 animate-spin" />
            <p>Loading Fetch.ai agents...</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t bg-muted/30">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Powered by Fetch.ai</span>
          <Button variant="ghost" size="sm" asChild>
            <a 
              href="https://docs.agentverse.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              Learn more
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
