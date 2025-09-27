'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Transaction } from '@/lib/analytics-service'
import { ArrowUpRight, ArrowDownLeft, ExternalLink, Clock, CheckCircle, XCircle } from 'lucide-react'

interface TransactionHistoryProps {
  transactions: Transaction[]
  loading?: boolean
}

export function TransactionHistory({ transactions, loading }: TransactionHistoryProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-3 border rounded-lg animate-pulse">
                <div className="w-8 h-8 bg-muted rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded mb-1"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
                <div className="h-6 bg-muted rounded w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No transactions found</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const formatValue = (value: string) => {
    const ethValue = parseInt(value) / Math.pow(10, 18)
    return ethValue.toFixed(4)
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'send':
        return <ArrowUpRight className="h-4 w-4 text-red-500" />
      case 'receive':
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />
      default:
        return <ArrowUpRight className="h-4 w-4 text-blue-500" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Transactions ({transactions.length})
          </CardTitle>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div key={tx.hash} className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-2">
                {getTransactionIcon(tx.type)}
                {getStatusIcon(tx.status)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="font-medium text-sm">
                    {tx.type === 'send' ? 'Sent' : tx.type === 'receive' ? 'Received' : 'Contract'}
                  </p>
                  <Badge variant={tx.status === 'success' ? 'default' : 'destructive'} className="text-xs">
                    {tx.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatTimestamp(tx.timestamp)}
                </p>
              </div>
              
              <div className="text-right">
                <p className="font-medium">
                  {formatValue(tx.value)} ETH
                </p>
                <p className="text-xs text-muted-foreground">
                  Gas: {parseInt(tx.gasUsed).toLocaleString()}
                </p>
              </div>
              
              <Button size="sm" variant="ghost" asChild>
                <a 
                  href={`https://etherscan.io/tx/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
