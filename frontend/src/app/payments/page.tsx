'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { WalletConnect } from '@/components/wallet-connect'
import { 
  Wallet, 
  Send, 
  Receive, 
  History,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink
} from 'lucide-react'

const transactions = [
  {
    id: '1',
    type: 'send',
    amount: '1.5 KDA',
    value: '$2,847',
    to: '0x1234...5678',
    status: 'completed',
    time: '2 min ago',
    hash: '0xabcd...efgh'
  },
  {
    id: '2',
    type: 'receive',
    amount: '0.8 KDA',
    value: '$1,520',
    from: '0x9876...5432',
    status: 'completed',
    time: '5 min ago',
    hash: '0x1234...5678'
  },
  {
    id: '3',
    type: 'send',
    amount: '2.0 KDA',
    value: '$3,800',
    to: '0x4567...8901',
    status: 'pending',
    time: '12 min ago',
    hash: '0x9876...5432'
  },
  {
    id: '4',
    type: 'receive',
    amount: '0.3 KDA',
    value: '$570',
    from: '0x2345...6789',
    status: 'completed',
    time: '18 min ago',
    hash: '0x4567...8901'
  },
  {
    id: '5',
    type: 'send',
    amount: '1.2 KDA',
    value: '$2,280',
    to: '0x3456...7890',
    status: 'failed',
    time: '25 min ago',
    hash: '0x2345...6789'
  }
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-400" />
    case 'pending':
      return <Clock className="h-4 w-4 text-yellow-400" />
    case 'failed':
      return <XCircle className="h-4 w-4 text-red-400" />
    default:
      return <Clock className="h-4 w-4 text-gray-400" />
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

export default function PaymentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white">Payments</h1>
            <Badge className="bg-kadena-500/20 text-kadena-400 border-kadena-500/30">
              Kadena Network
            </Badge>
          </div>
          <WalletConnect />
        </div>
      </header>

      <div className="p-6 space-y-8">
        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-kadena-500/20 to-kadena-600/20 border-kadena-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-kadena-500/30">
                  <Wallet className="h-5 w-5 text-kadena-400" />
                </div>
                <div>
                  <p className="text-sm text-kadena-300">Total Balance</p>
                  <p className="text-2xl font-bold text-white">12.5 KDA</p>
                  <p className="text-sm text-kadena-300">≈ $23,750</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/30">
                  <ArrowDownLeft className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-green-300">Received Today</p>
                  <p className="text-2xl font-bold text-white">3.2 KDA</p>
                  <p className="text-sm text-green-300">≈ $6,080</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/30">
                  <ArrowUpRight className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-blue-300">Sent Today</p>
                  <p className="text-2xl font-bold text-white">1.8 KDA</p>
                  <p className="text-sm text-blue-300">≈ $3,420</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button className="bg-gradient-to-r from-kadena-500 to-kadena-600 hover:from-kadena-600 hover:to-kadena-700 text-white px-6 py-3">
            <Send className="h-5 w-5 mr-2" />
            Send Payment
          </Button>
          <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3">
            <Receive className="h-5 w-5 mr-2" />
            Receive Payment
          </Button>
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700/50 px-6 py-3">
            <History className="h-5 w-5 mr-2" />
            Transaction History
          </Button>
        </div>

        {/* Recent Transactions */}
        <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
              <History className="h-5 w-5 text-kadena-400" />
              Recent Transactions
            </CardTitle>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700/50">
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="group flex items-center justify-between p-4 rounded-xl bg-gray-800/30 hover:bg-gray-700/50 transition-all duration-300 hover:shadow-lg hover:shadow-kadena-500/5"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${
                    tx.type === 'send' 
                      ? 'bg-red-500/20' 
                      : 'bg-green-500/20'
                  }`}>
                    {tx.type === 'send' ? (
                      <ArrowUpRight className="h-4 w-4 text-red-400" />
                    ) : (
                      <ArrowDownLeft className="h-4 w-4 text-green-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white">
                        {tx.amount}
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
                      <span className="text-xs">
                        {tx.type === 'send' ? `To: ${tx.to}` : `From: ${tx.from}`}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {getStatusIcon(tx.status)}
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

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border-0">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-white mb-1">47</div>
              <div className="text-sm text-gray-400">Total Transactions</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border-0">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">42</div>
              <div className="text-sm text-gray-400">Successful</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border-0">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">3</div>
              <div className="text-sm text-gray-400">Pending</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border-0">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-red-400 mb-1">2</div>
              <div className="text-sm text-gray-400">Failed</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}