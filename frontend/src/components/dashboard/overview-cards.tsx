'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, DollarSign, Activity, Bot, Shield, Zap } from 'lucide-react'

const stats = [
  {
    title: 'Total Value Locked',
    value: '$45,231.89',
    change: '+20.1%',
    trend: 'up',
    icon: DollarSign,
    color: 'from-blue-500 to-cyan-500',
    glow: 'glow'
  },
  {
    title: 'Active Agents',
    value: '12',
    change: '+2',
    trend: 'up',
    icon: Bot,
    color: 'from-purple-500 to-pink-500',
    glow: 'glow-purple'
  },
  {
    title: 'Transactions',
    value: '573',
    change: '+201',
    trend: 'up',
    icon: Activity,
    color: 'from-green-500 to-emerald-500',
    glow: ''
  },
  {
    title: 'Success Rate',
    value: '98.5%',
    change: '-0.1%',
    trend: 'down',
    icon: Shield,
    color: 'from-orange-500 to-red-500',
    glow: ''
  },
]

export function OverviewCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div key={stat.title} className={`glass-dark rounded-xl p-6 hover-lift ${stat.glow}`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className={`flex items-center gap-1 text-sm ${
                  stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {stat.change}
                </div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">{stat.title}</h3>
            <p className="text-gray-400 text-sm">
              {stat.title === 'Total Value Locked' && 'Across all delegated wallets'}
              {stat.title === 'Active Agents' && 'AI agents running operations'}
              {stat.title === 'Transactions' && 'Processed this hour'}
              {stat.title === 'Success Rate' && 'Operation success rate'}
            </p>
          </div>
        )
      })}
    </div>
  )
}
