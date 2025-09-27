'use client'

import { useState } from 'react'
import { transactionService, Transaction } from '@/lib/transaction-service'
import { Send, ArrowRightLeft, Bridge, Loader2 } from 'lucide-react'

interface TransactionFormProps {
  onTransactionComplete: (transaction: Transaction) => void
  balance: string
}

export function TransactionForm({ onTransactionComplete, balance }: TransactionFormProps) {
  const [type, setType] = useState<'send' | 'swap' | 'bridge'>('send')
  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (type === 'send') {
        if (!to || !amount) {
          throw new Error('Please fill in all fields')
        }
        
        if (parseFloat(amount) > parseFloat(balance)) {
          throw new Error('Insufficient balance')
        }

        const transaction = await transactionService.sendTransaction(to, amount)
        onTransactionComplete(transaction)
        
        // Reset form
        setTo('')
        setAmount('')
      } else if (type === 'swap') {
        // Mock swap transaction
        const transaction: Transaction = {
          id: 'swap_' + Math.random().toString(16).substr(2, 8),
          type: 'swap',
          amount,
          value: (parseFloat(amount) * 1900).toFixed(2),
          status: 'completed',
          timestamp: Date.now(),
          hash: '0x' + Math.random().toString(16).substr(2, 64)
        }
        onTransactionComplete(transaction)
        setAmount('')
      } else if (type === 'bridge') {
        // Mock bridge transaction
        const transaction: Transaction = {
          id: 'bridge_' + Math.random().toString(16).substr(2, 8),
          type: 'bridge',
          amount,
          value: (parseFloat(amount) * 1900).toFixed(2),
          status: 'completed',
          timestamp: Date.now(),
          hash: '0x' + Math.random().toString(16).substr(2, 64)
        }
        onTransactionComplete(transaction)
        setAmount('')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
      <h3 className="text-xl font-semibold text-white mb-4">Send Transaction</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Transaction Type */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Transaction Type
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType('send')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                type === 'send'
                  ? 'bg-kadena-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Send className="h-4 w-4" />
              Send
            </button>
            <button
              type="button"
              onClick={() => setType('swap')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                type === 'swap'
                  ? 'bg-kadena-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <ArrowRightLeft className="h-4 w-4" />
              Swap
            </button>
            <button
              type="button"
              onClick={() => setType('bridge')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                type === 'bridge'
                  ? 'bg-kadena-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Bridge className="h-4 w-4" />
              Bridge
            </button>
          </div>
        </div>

        {/* Recipient Address (only for send) */}
        {type === 'send' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Recipient Address
            </label>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-kadena-500 focus:border-transparent"
              required
            />
          </div>
        )}

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Amount (KDA)
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.0001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-kadena-500 focus:border-transparent"
              required
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
              KDA
            </div>
          </div>
          <div className="mt-1 text-sm text-gray-400">
            Balance: {balance} KDA
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !amount}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-kadena-500 to-kadena-600 hover:from-kadena-600 hover:to-kadena-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-kadena-500/25"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              {type === 'send' && <Send className="h-4 w-4" />}
              {type === 'swap' && <ArrowRightLeft className="h-4 w-4" />}
              {type === 'bridge' && <Bridge className="h-4 w-4" />}
              {type === 'send' ? 'Send KDA' : type === 'swap' ? 'Swap Tokens' : 'Bridge Tokens'}
            </>
          )}
        </button>
      </form>
    </div>
  )
}
