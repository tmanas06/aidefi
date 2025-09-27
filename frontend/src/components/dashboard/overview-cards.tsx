'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  TrendingUp, 
  Wallet, 
  Bot, 
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

const cards = [
  {
    title: 'Total Value Locked',
    value: '$2,847,392',
    change: '+12.5%',
    trend: 'up',
    icon: TrendingUp,
    color: 'from-kadena-500 to-kadena-600',
    bgColor: 'bg-kadena-500/10',
    iconColor: 'text-kadena-500'
  },
  {
    title: 'Active Delegated Accounts',
    value: '24',
    change: '+3',
    trend: 'up',
    icon: Bot,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-500/10',
    iconColor: 'text-purple-500'
  },
  {
    title: 'Total Transactions',
    value: '1,847',
    change: '+8.2%',
    trend: 'up',
    icon: Activity,
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-500/10',
    iconColor: 'text-green-500'
  },
  {
    title: 'AI Bot Performance',
    value: '94.2%',
    change: '-2.1%',
    trend: 'down',
    icon: Wallet,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-500/10',
    iconColor: 'text-blue-500'
  }
]

export function OverviewCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon
        const TrendIcon = card.trend === 'up' ? ArrowUpRight : ArrowDownRight
        
        return (
          <Card key={index} className="group relative overflow-hidden border-0 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm hover:shadow-xl hover:shadow-kadena-500/10 transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-white">
                  {card.value}
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  card.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  <TrendIcon className="h-3 w-3" />
                  {card.change}
                </div>
              </div>
              <div className="mt-2">
                <div className={`h-1 w-full rounded-full ${card.bgColor}`}>
                  <div 
                    className={`h-1 rounded-full bg-gradient-to-r ${card.color} transition-all duration-1000`}
                    style={{ width: card.trend === 'up' ? '85%' : '60%' }}
                  />
                </div>
              </div>
            </CardContent>
            
            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-kadena-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </Card>
        )
      })}
    </div>
  )
}