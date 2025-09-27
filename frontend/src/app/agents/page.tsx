'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SimpleWalletConnect } from '@/components/simple-wallet-connect'
import { 
  Bot, 
  Play, 
  Pause, 
  Settings, 
  Plus,
  TrendingUp,
  Activity,
  DollarSign,
  Clock,
  Zap
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
    lastActivity: '2 min ago',
    spendingLimit: '1.0 KDA',
    spentToday: '0.3 KDA'
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
    lastActivity: '15 min ago',
    spendingLimit: '0.5 KDA',
    spentToday: '0.1 KDA'
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
    lastActivity: '5 min ago',
    spendingLimit: '2.0 KDA',
    spentToday: '0.8 KDA'
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

export default function AgentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white">AI Agents</h1>
            <Badge className="bg-kadena-500/20 text-kadena-400 border-kadena-500/30">
              {agents.length} Active
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <Button className="bg-kadena-500 hover:bg-kadena-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Agent
            </Button>
            <SimpleWalletConnect />
          </div>
        </div>
      </header>

      <div className="p-6 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-kadena-500/20">
                  <Bot className="h-5 w-5 text-kadena-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Agents</p>
                  <p className="text-2xl font-bold text-white">{agents.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Profit</p>
                  <p className="text-2xl font-bold text-green-400">+$6,647</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Activity className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Trades</p>
                  <p className="text-2xl font-bold text-white">101</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Zap className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Active Agents</p>
                  <p className="text-2xl font-bold text-purple-400">2</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agents List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <Card key={agent.id} className="group bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border-0 hover:shadow-xl hover:shadow-kadena-500/10 transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-kadena-500/20">
                    <Bot className="h-5 w-5 text-kadena-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white">{agent.name}</CardTitle>
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
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
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

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Spending Limit:</span>
                    <span className="text-white">{agent.spendingLimit}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Spent Today:</span>
                    <span className="text-kadena-400">{agent.spentToday}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Last Activity:</span>
                    <span className="text-gray-300">{agent.lastActivity}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-kadena-500/20 hover:bg-kadena-500/30 text-kadena-400 border border-kadena-500/30"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700/50"
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}