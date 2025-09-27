'use client'

import { Agent } from '@/types/chat'
import { AgentCard } from './agent-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Filter, Users } from 'lucide-react'
import { useState } from 'react'

interface AgentListProps {
  agents: Agent[]
  onStartChat: (agentId: string) => void
  selectedAgentId?: string
}

export function AgentList({ agents, onStartChat, selectedAgentId }: AgentListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState<Agent['role'] | 'all'>('all')

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === 'all' || agent.role === selectedRole
    
    return matchesSearch && matchesRole
  })

  const onlineAgents = filteredAgents.filter(agent => agent.status === 'online')
  const busyAgents = filteredAgents.filter(agent => agent.status === 'busy')
  const offlineAgents = filteredAgents.filter(agent => agent.status === 'offline')

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users className="h-5 w-5" />
          Available Agents
        </h2>
        
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {(['all', 'customer_service', 'sales', 'technical', 'general'] as const).map(role => (
              <Button
                key={role}
                variant={selectedRole === role ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedRole(role)}
              >
                {role === 'all' ? 'All' : role.replace('_', ' ')}
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
                <AgentCard
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
                <AgentCard
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
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  onStartChat={onStartChat}
                  isSelected={selectedAgentId === agent.id}
                />
              ))}
            </div>
          </div>
        )}

        {filteredAgents.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No agents found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
