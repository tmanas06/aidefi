'use client'

import { MainLayout } from '@/components/layout/main-layout'
import { ModernCard, ModernCardContent, ModernCardHeader, ModernCardTitle } from '@/components/ui/modern-card'
import { ModernButton } from '@/components/ui/modern-button'
import { Badge } from '@/components/ui/badge'
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
  Zap,
  Target,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Sparkles
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
    <MainLayout 
      title="AI Agents" 
      subtitle="Manage your automated trading bots"
    >
      <div className="p-6 space-y-8">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge className="bg-kadena-500/20 text-kadena-400 border-kadena-500/30 px-3 py-1">
              <Bot className="h-3 w-3 mr-1" />
              {agents.length} Agents
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-3 py-1">
              <CheckCircle className="h-3 w-3 mr-1" />
              2 Active
            </Badge>
          </div>
          <ModernButton variant="default" size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Create New Agent
          </ModernButton>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ModernCard variant="glass" hover className="overflow-hidden">
            <ModernCardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-kadena-500 to-kadena-600">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-medium">Total Agents</p>
                  <p className="text-3xl font-bold text-white">{agents.length}</p>
                  <p className="text-xs text-kadena-400">+1 this week</p>
                </div>
              </div>
            </ModernCardContent>
          </ModernCard>

          <ModernCard variant="glass" hover className="overflow-hidden">
            <ModernCardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-medium">Total Profit</p>
                  <p className="text-3xl font-bold text-green-400">+$6,647</p>
                  <p className="text-xs text-green-400">+12.5% this month</p>
                </div>
              </div>
            </ModernCardContent>
          </ModernCard>

          <ModernCard variant="glass" hover className="overflow-hidden">
            <ModernCardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-medium">Total Trades</p>
                  <p className="text-3xl font-bold text-white">101</p>
                  <p className="text-xs text-blue-400">+23 this week</p>
                </div>
              </div>
            </ModernCardContent>
          </ModernCard>

          <ModernCard variant="glass" hover className="overflow-hidden">
            <ModernCardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-medium">Active Agents</p>
                  <p className="text-3xl font-bold text-purple-400">2</p>
                  <p className="text-xs text-purple-400">67% uptime</p>
                </div>
              </div>
            </ModernCardContent>
          </ModernCard>
        </div>

        {/* Agents List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <ModernCard key={agent.id} variant="glass" hover glow className="group overflow-hidden">
              <ModernCardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-kadena-500 to-kadena-600">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <ModernCardTitle className="text-white text-lg">{agent.name}</ModernCardTitle>
                    <p className="text-sm text-gray-400 font-medium">{agent.strategy}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(agent.status)}>
                    {agent.status === 'active' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {agent.status === 'paused' && <Pause className="h-3 w-3 mr-1" />}
                    {agent.status === 'error' && <AlertCircle className="h-3 w-3 mr-1" />}
                    {agent.status}
                  </Badge>
                  <ModernButton
                    size="sm"
                    variant="ghost"
                    className="text-gray-400 hover:text-white hover:bg-gray-600/50"
                  >
                    {agent.status === 'active' ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </ModernButton>
                </div>
              </ModernCardHeader>
              
              <ModernCardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-gray-800/50">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <TrendingUp className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-400 font-medium">Performance</span>
                    </div>
                    <div className={`text-2xl font-bold ${getPerformanceColor(agent.performance)}`}>
                      {agent.performance}%
                    </div>
                  </div>
                  
                  <div className="text-center p-3 rounded-lg bg-gray-800/50">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Activity className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-400 font-medium">Trades</span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {agent.trades}
                    </div>
                  </div>
                  
                  <div className="text-center p-3 rounded-lg bg-gray-800/50">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-400 font-medium">Profit</span>
                    </div>
                    <div className="text-2xl font-bold text-green-400">
                      {agent.profit}
                    </div>
                  </div>
                  
                  <div className="text-center p-3 rounded-lg bg-gray-800/50">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-400 font-medium">Uptime</span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {agent.uptime}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 p-4 rounded-lg bg-gray-800/30">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400 font-medium">Spending Limit</span>
                    <span className="text-sm text-white font-semibold">{agent.spendingLimit}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400 font-medium">Spent Today</span>
                    <span className="text-sm text-kadena-400 font-semibold">{agent.spentToday}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400 font-medium">Last Activity</span>
                    <span className="text-sm text-gray-300 font-semibold">{agent.lastActivity}</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <ModernButton 
                    size="sm" 
                    variant="outline"
                    className="flex-1 border-kadena-500/50 text-kadena-400 hover:bg-kadena-500/10"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </ModernButton>
                  <ModernButton 
                    size="sm" 
                    variant="ghost"
                    className="flex-1 text-gray-300 hover:bg-gray-700/50"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Details
                  </ModernButton>
                </div>
              </ModernCardContent>
            </ModernCard>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}