'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Bot, Activity, MessageCircle, Settings } from 'lucide-react'

const agents = [
  {
    id: 'wallet-agent',
    name: 'Wallet Agent',
    status: 'online',
    description: 'Handles wallet operations and user requests',
    lastActivity: '2 minutes ago',
    tasks: 3,
  },
  {
    id: 'payment-agent',
    name: 'Payment Agent',
    status: 'online',
    description: 'Manages x402 payments and transaction validation',
    lastActivity: '1 minute ago',
    tasks: 1,
  },
  {
    id: 'identity-agent',
    name: 'Identity Agent',
    status: 'offline',
    description: 'Handles Self Protocol identity verification',
    lastActivity: '5 minutes ago',
    tasks: 0,
  },
]

export function AgentStatus() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'offline':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'busy':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <div className="glass-dark rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Bot className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Agent Status</h2>
          <p className="text-gray-400">Monitor your AI agents and their operations</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {agents.map((agent) => (
          <div key={agent.id} className="glass-dark rounded-xl p-4 hover-lift">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${
                  agent.status === 'online' ? 'bg-green-500/20' : 'bg-gray-700/50'
                }`}>
                  <Bot className={`h-6 w-6 ${
                    agent.status === 'online' ? 'text-green-400' : 'text-gray-400'
                  }`} />
                </div>
                <div>
                  <div className="text-white font-semibold text-lg">{agent.name}</div>
                  <div className="text-sm text-gray-400 mb-1">{agent.description}</div>
                  <div className="text-xs text-gray-500">
                    Last activity: {agent.lastActivity}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className={`${getStatusColor(agent.status)} border`}>
                  <Activity className="h-3 w-3 mr-1" />
                  {agent.status}
                </Badge>
                {agent.tasks > 0 && (
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 border">
                    {agent.tasks} tasks
                  </Badge>
                )}
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-gray-400 hover:text-white hover:bg-gray-700/50"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-700/50">
        <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 hover-lift">
          <MessageCircle className="mr-2 h-4 w-4" />
          Open Agent Chat
        </Button>
      </div>
    </div>
  )
}
