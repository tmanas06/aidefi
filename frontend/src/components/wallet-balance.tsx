'use client'

import { useState, useEffect } from 'react'
import { transactionService, WalletBalance } from '@/lib/transaction-service'
import { SendModal } from '@/components/send-modal'
import { Wallet, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'

interface WalletBalanceProps {
  address: string
}

export function WalletBalance({ address }: WalletBalanceProps) {
  const [balance, setBalance] = useState<WalletBalance | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showSendModal, setShowSendModal] = useState(false)

  const loadBalance = async () => {
    try {
      const walletBalance = await transactionService.getBalance(address)
      setBalance(walletBalance)
    } catch (error) {
      console.error('Failed to load balance:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshBalance = async () => {
    setIsRefreshing(true)
    await loadBalance()
    setIsRefreshing(false)
  }

  const handleTransactionSent = () => {
    // Refresh balance after transaction
    refreshBalance()
  }

  useEffect(() => {
    if (address) {
      loadBalance()
    }
  }, [address])

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-kadena-500/20 to-kadena-600/20 border border-kadena-500/30 rounded-xl p-6">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-kadena-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-kadena-300">Loading balance...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!balance) {
    return (
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
        <div className="text-center">
          <Wallet className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No balance data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Balance Card */}
      <div className="bg-gradient-to-br from-kadena-500/20 to-kadena-600/20 border border-kadena-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-kadena-400" />
            <span className="text-kadena-300 font-medium">Wallet Balance</span>
          </div>
          <button
            onClick={refreshBalance}
            disabled={isRefreshing}
            className="p-2 text-kadena-400 hover:text-kadena-300 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        <div className="space-y-2">
          <div className="text-3xl font-bold text-white">
            {balance.kda} KDA
          </div>
          <div className="text-lg text-kadena-300">
            ≈ ${balance.usd}
          </div>
          <div className="text-sm text-kadena-400">
            {balance.address.slice(0, 6)}...{balance.address.slice(-4)}
          </div>
        </div>
      </div>

      {/* Balance Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-400" />
            <span className="text-sm text-gray-400">24h Change</span>
          </div>
          <div className="text-lg font-semibold text-green-400">+2.4%</div>
          <div className="text-xs text-gray-500">+$568.00</div>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="h-4 w-4 text-red-400" />
            <span className="text-sm text-gray-400">7d Change</span>
          </div>
          <div className="text-lg font-semibold text-red-400">-1.2%</div>
          <div className="text-xs text-gray-500">-$284.00</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => setShowSendModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-kadena-500/20 to-kadena-600/20 hover:from-kadena-500/30 hover:to-kadena-600/30 border border-kadena-500/30 rounded-lg text-kadena-300 hover:text-white transition-all duration-300"
        >
          <Wallet className="h-4 w-4" />
          <span className="text-sm font-medium">Send</span>
        </button>
        <button className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500/20 to-green-600/20 hover:from-green-500/30 hover:to-green-600/30 border border-green-500/30 rounded-lg text-green-300 hover:text-white transition-all duration-300">
          <TrendingUp className="h-4 w-4" />
          <span className="text-sm font-medium">Receive</span>
        </button>
      </div>

      {/* Send Modal */}
      <SendModal 
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
        onTransactionSent={handleTransactionSent}
      />
    </div>
  )
}