'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatAddress, formatCurrency } from '@/lib/utils'
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle } from 'lucide-react'

const transactions = [
  {
    id: '0x1234...5678',
    type: 'send',
    amount: '100.00',
    currency: 'USDC',
    to: '0xabcd...efgh',
    status: 'completed',
    timestamp: '2 minutes ago',
  },
  {
    id: '0x2345...6789',
    type: 'receive',
    amount: '50.00',
    currency: 'MATIC',
    from: '0xbcde...fghi',
    status: 'completed',
    timestamp: '5 minutes ago',
  },
  {
    id: '0x3456...7890',
    type: 'send',
    amount: '25.00',
    currency: 'USDC',
    to: '0xcdef...ghij',
    status: 'pending',
    timestamp: '10 minutes ago',
  },
  {
    id: '0x4567...8901',
    type: 'send',
    amount: '75.00',
    currency: 'USDC',
    to: '0xdefg...hijk',
    status: 'failed',
    timestamp: '15 minutes ago',
  },
]

export function RecentTransactions() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-400" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-400" />
      default:
        return null
    }
  }

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

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                {tx.type === 'send' ? (
                  <ArrowUpRight className="h-5 w-5 text-red-400" />
                ) : (
                  <ArrowDownLeft className="h-5 w-5 text-green-400" />
                )}
                <div>
                  <div className="text-white font-medium">
                    {tx.type === 'send' ? 'Sent' : 'Received'} {formatCurrency(parseFloat(tx.amount))} {tx.currency}
                  </div>
                  <div className="text-sm text-gray-400">
                    {tx.type === 'send' ? 'To' : 'From'}: {tx.type === 'send' ? tx.to : tx.from}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className={getStatusColor(tx.status)}>
                  {getStatusIcon(tx.status)}
                  <span className="ml-1 capitalize">{tx.status}</span>
                </Badge>
                <div className="text-right">
                  <div className="text-sm text-gray-400">{tx.timestamp}</div>
                  <div className="text-xs text-gray-500 font-mono">{tx.id}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
