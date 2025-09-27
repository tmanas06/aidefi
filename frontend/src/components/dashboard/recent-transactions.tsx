'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Bot, 
  Wallet,
  Clock,
  ExternalLink
} from 'lucide-react'

const transactions = [
  {
    id: '1',
    type: 'swap',
    direction: 'out',
    amount: '1.5 KDA',
    token: 'TEST',
    value: '$2,847',
    status: 'completed',
    time: '2 min ago',
    hash: '0x1234...5678',
    bot: 'AI-Bot-01'
  },
  {
    id: '2',
    type: 'bridge',
    direction: 'out',
    amount: '0.8 KDA',
    token: 'KDA',
    value: '$1,520',
    status: 'pending',
    time: '5 min ago',
    hash: '0xabcd...efgh',
    bot: 'AI-Bot-02'
  },
  {
    id: '3',
    type: 'delegate',
    direction: 'in',
    amount: '2.0 KDA',
    token: 'KDA',
    value: '$3,800',
    status: 'completed',
    time: '12 min ago',
    hash: '0x9876...5432',
    bot: null
  },
  {
    id: '4',
    type: 'swap',
    direction: 'out',
    amount: '0.3 KDA',
    token: 'TEST',
    value: '$570',
    status: 'completed',
    time: '18 min ago',
    hash: '0x4567...8901',
    bot: 'AI-Bot-01'
  },
  {
    id: '5',
    type: 'bridge',
    direction: 'in',
    amount: '1.2 KDA',
    token: 'KDA',
    value: '$2,280',
    status: 'completed',
    time: '25 min ago',
    hash: '0x2345...6789',
    bot: 'AI-Bot-03'
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500/20 text-green-400 border-green-500/30'
    case 'pending':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    case 'failed':
      return 'bg-red-500/20 text-red-400 border-red-500/30'
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }
}

const getTypeIcon = (type: string, direction: string) => {
  if (type === 'delegate') {
    return <Wallet className="h-4 w-4" />
  }
  if (type === 'bridge') {
    return <ArrowUpRight className="h-4 w-4" />
  }
  return direction === 'out' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'swap':
      return 'text-blue-400'
    case 'bridge':
      return 'text-purple-400'
    case 'delegate':
      return 'text-green-400'
    default:
      return 'text-gray-400'
  }
}

export function RecentTransactions() {
  return (
    <Card className="border-0 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-semibold text-white">
          Recent Transactions
        </CardTitle>
        <button className="text-sm text-kadena-400 hover:text-kadena-300 transition-colors">
          View All
        </button>
      </CardHeader>
      <CardContent className="space-y-4">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="group flex items-center justify-between p-4 rounded-xl bg-gray-800/30 hover:bg-gray-700/50 transition-all duration-300 hover:shadow-lg hover:shadow-kadena-500/5"
          >
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg bg-gray-700/50 ${getTypeColor(tx.type)}`}>
                {getTypeIcon(tx.type, tx.direction)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-white">
                    {tx.amount} {tx.token}
                  </span>
                  <Badge className={getStatusColor(tx.status)}>
                    {tx.status}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>{tx.value}</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {tx.time}
                  </div>
                  {tx.bot && (
                    <div className="flex items-center gap-1">
                      <Bot className="h-3 w-3" />
                      {tx.bot}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-mono">
                {tx.hash}
              </span>
              <button className="p-1 rounded hover:bg-gray-600/50 transition-colors">
                <ExternalLink className="h-3 w-3 text-gray-400" />
              </button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}