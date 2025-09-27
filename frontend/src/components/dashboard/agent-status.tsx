'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Bot, 
  Play, 
  Pause, 
  Settings, 
  TrendingUp,
  Activity,
  DollarSign,
  Clock
} from 'lucide-react'

const agents = [
  {
    id: '1',
    name: 'AI-Bot-01',
    status: 'active',
    performance: 94.2,
    trades: 47,
    profit: '+$2,847',
    uptime: '2d 14h',
    strategy: 'DCA + Momentum',
    lastActivity: '2 min ago'
  },
  {
    id: '2',
    name: 'AI-Bot-02',
    status: 'paused',
    performance: 87.5,
    trades: 23,
    profit: '+$1,520',
    uptime: '1d 8h',
    strategy: 'Arbitrage',
    lastActivity: '15 min ago'
  },
  {
    id: '3',
    name: 'AI-Bot-03',
    status: 'active',
    performance: 91.8,
    trades: 31,
    profit: '+$2,280',
    uptime: '3d 2h',
    strategy: 'Grid Trading',
    lastActivity: '5 min ago'
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-500/20 text-green-400 border-green-500/30'
    case 'paused':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    case 'error':
      return 'bg-red-500/20 text-red-400 border-red-500/30'
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }
}

const getPerformanceColor = (performance: number) => {
  if (performance >= 90) return 'text-green-400'
  if (performance >= 80) return 'text-yellow-400'
  return 'text-red-400'
}

export function AgentStatus() {
  return (
    <Card className="border-0 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
          <Bot className="h-5 w-5 text-kadena-400" />
          AI Agents
        </CardTitle>
        <Button className="bg-kadena-500 hover:bg-kadena-600 text-white">
          <Settings className="h-4 w-4 mr-2" />
          Configure
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="group p-4 rounded-xl bg-gray-800/30 hover:bg-gray-700/50 transition-all duration-300 hover:shadow-lg hover:shadow-kadena-500/5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-kadena-500/20">
                  <Bot className="h-4 w-4 text-kadena-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{agent.name}</h3>
                  <p className="text-sm text-gray-400">{agent.strategy}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(agent.status)}>
                  {agent.status}
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gray-400 hover:text-white hover:bg-gray-600/50"
                >
                  {agent.status === 'active' ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingUp className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-400">Performance</span>
                </div>
                <div className={`text-lg font-semibold ${getPerformanceColor(agent.performance)}`}>
                  {agent.performance}%
                </div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Activity className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-400">Trades</span>
                </div>
                <div className="text-lg font-semibold text-white">
                  {agent.trades}
                </div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <DollarSign className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-400">Profit</span>
                </div>
                <div className="text-lg font-semibold text-green-400">
                  {agent.profit}
                </div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-400">Uptime</span>
                </div>
                <div className="text-lg font-semibold text-white">
                  {agent.uptime}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Last activity: {agent.lastActivity}</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Live</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}