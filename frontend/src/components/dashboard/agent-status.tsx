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
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Bot className="mr-2 h-5 w-5" />
          Agent Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {agents.map((agent) => (
            <div key={agent.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-700 rounded-lg">
                  <Bot className="h-5 w-5 text-gray-300" />
                </div>
                <div>
                  <div className="text-white font-medium">{agent.name}</div>
                  <div className="text-sm text-gray-400">{agent.description}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Last activity: {agent.lastActivity}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className={getStatusColor(agent.status)}>
                  <Activity className="h-3 w-3 mr-1" />
                  {agent.status}
                </Badge>
                {agent.tasks > 0 && (
                  <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    {agent.tasks} tasks
                  </Badge>
                )}
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-800">
          <Button variant="neon" className="w-full">
            <MessageCircle className="mr-2 h-4 w-4" />
            Open Agent Chat
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
