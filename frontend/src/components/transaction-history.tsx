'use client'

import { useState, useEffect } from 'react'
import { transactionService, Transaction } from '@/lib/transaction-service'
import { ArrowUpRight, ArrowDownLeft, ArrowRightLeft, Bridge, Clock, CheckCircle, XCircle, ExternalLink } from 'lucide-react'

interface TransactionHistoryProps {
  address: string
}

export function TransactionHistory({ address }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const txHistory = await transactionService.getTransactionHistory(address, 20)
        setTransactions(txHistory)
      } catch (error) {
        console.error('Failed to load transactions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (address) {
      loadTransactions()
    }
  }, [address])

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'send':
        return <ArrowUpRight className="h-4 w-4 text-red-400" />
      case 'receive':
        return <ArrowDownLeft className="h-4 w-4 text-green-400" />
      case 'swap':
        return <ArrowRightLeft className="h-4 w-4 text-blue-400" />
      case 'bridge':
        return <Bridge className="h-4 w-4 text-purple-400" />
      default:
        return <ArrowUpRight className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusIcon = (status: Transaction['status']) => {
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

  const formatTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const formatAddress = (address: string) => {
    if (!address) return 'N/A'
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (isLoading) {
    return (
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-xl font-semibold text-white mb-4">Transaction History</h3>
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-kadena-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-400">Loading transactions...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white">Transaction History</h3>
        <div className="text-sm text-gray-400">
          {transactions.length} transactions
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <ArrowUpRight className="h-8 w-8 text-gray-500" />
          </div>
          <p className="text-gray-400">No transactions yet</p>
          <p className="text-sm text-gray-500 mt-1">Your transaction history will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gray-600 rounded-full">
                  {getTransactionIcon(tx.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white capitalize">
                      {tx.type}
                    </span>
                    {getStatusIcon(tx.status)}
                  </div>
                  <div className="text-sm text-gray-400">
                    {tx.type === 'send' ? `To: ${formatAddress(tx.to)}` : 
                     tx.type === 'receive' ? `From: ${formatAddress(tx.from)}` :
                     tx.type === 'swap' ? 'Token Swap' : 'Cross-chain Bridge'}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${
                    tx.type === 'receive' ? 'text-green-400' : 'text-white'
                  }`}>
                    {tx.type === 'receive' ? '+' : '-'}{tx.amount} KDA
                  </span>
                  {tx.hash && (
                    <a
                      href={`https://chain-20.evm-testnet-blockscout.chainweb.com/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-kadena-400 hover:text-kadena-300 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
                <div className="text-sm text-gray-400">
                  ${tx.value} • {formatTime(tx.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}