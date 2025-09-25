'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react'

const stats = [
  {
    title: 'Total Volume',
    value: '$12,345.67',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
  },
  {
    title: 'Active Payments',
    value: '23',
    change: '+8.2%',
    trend: 'up',
    icon: Activity,
  },
  {
    title: 'Success Rate',
    value: '98.7%',
    change: '+2.1%',
    trend: 'up',
    icon: TrendingUp,
  },
  {
    title: 'Failed Transactions',
    value: '3',
    change: '-15.3%',
    trend: 'down',
    icon: TrendingDown,
  },
]

export function OverviewCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="bg-gray-900/50 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <p className={`text-xs flex items-center mt-1 ${
                stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
              }`}>
                {stat.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {stat.change}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
