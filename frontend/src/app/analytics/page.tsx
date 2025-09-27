'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SimpleWalletConnect } from '@/components/simple-wallet-connect'
import { 
  TrendingUp, 
  TrendingDown,
  Activity, 
  DollarSign,
  Bot,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react'

const performanceData = [
  { time: '00:00', value: 85 },
  { time: '04:00', value: 87 },
  { time: '08:00', value: 92 },
  { time: '12:00', value: 89 },
  { time: '16:00', value: 94 },
  { time: '20:00', value: 96 },
  { time: '24:00', value: 94 }
]

const tradingPairs = [
  { pair: 'KDA/TEST', volume: '$2,847,392', change: '+12.5%', trend: 'up' },
  { pair: 'KDA/USDC', volume: '$1,520,847', change: '+8.2%', trend: 'up' },
  { pair: 'TEST/USDC', volume: '$847,293', change: '-2.1%', trend: 'down' },
  { pair: 'KDA/ETH', volume: '$392,847', change: '+15.3%', trend: 'up' }
]

const agentPerformance = [
  { name: 'AI-Bot-01', trades: 47, profit: '$2,847', success: 94.2 },
  { name: 'AI-Bot-02', trades: 23, profit: '$1,520', success: 87.5 },
  { name: 'AI-Bot-03', trades: 31, profit: '$2,280', success: 91.8 }
]

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white">Analytics</h1>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-green-400 font-medium">Live Data</span>
            </div>
          </div>
          <SimpleWalletConnect />
        </div>
      </header>

      <div className="p-6 space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-kadena-500/20">
                  <DollarSign className="h-5 w-5 text-kadena-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Volume</p>
                  <p className="text-2xl font-bold text-white">$5.6M</p>
                  <p className="text-xs text-green-400 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +12.5%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <Activity className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Trades</p>
                  <p className="text-2xl font-bold text-white">1,847</p>
                  <p className="text-xs text-green-400 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +8.2%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Bot className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Active Agents</p>
                  <p className="text-2xl font-bold text-white">24</p>
                  <p className="text-xs text-green-400 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +3
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Success Rate</p>
                  <p className="text-2xl font-bold text-white">94.2%</p>
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <TrendingDown className="h-3 w-3" />
                    -2.1%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Performance Chart */}
          <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border-0">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <LineChart className="h-5 w-5 text-kadena-400" />
                Performance Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2">
                {performanceData.map((data, index) => (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <div 
                      className="w-8 bg-gradient-to-t from-kadena-500 to-kadena-400 rounded-t"
                      style={{ height: `${data.value}%` }}
                    />
                    <span className="text-xs text-gray-400">{data.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trading Pairs */}
          <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border-0">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <PieChart className="h-5 w-5 text-purple-400" />
                Top Trading Pairs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {tradingPairs.map((pair, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
                  <div>
                    <p className="font-medium text-white">{pair.pair}</p>
                    <p className="text-sm text-gray-400">{pair.volume}</p>
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    pair.trend === 'up' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {pair.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    {pair.change}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Agent Performance Table */}
        <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border-0">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bot className="h-5 w-5 text-kadena-400" />
              Agent Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700/50">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Agent</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Trades</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Profit</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Success Rate</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {agentPerformance.map((agent, index) => (
                    <tr key={index} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          <span className="text-white font-medium">{agent.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-white">{agent.trades}</td>
                      <td className="py-3 px-4 text-green-400 font-medium">{agent.profit}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-700 rounded-full">
                            <div 
                              className="h-2 bg-gradient-to-r from-kadena-500 to-kadena-400 rounded-full"
                              style={{ width: `${agent.success}%` }}
                            />
                          </div>
                          <span className="text-white text-sm">{agent.success}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}