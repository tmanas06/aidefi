'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { transactionService } from '@/lib/transaction-service'
import { X, Send, AlertCircle, CheckCircle } from 'lucide-react'

interface SendModalProps {
  isOpen: boolean
  onClose: () => void
  onTransactionSent?: (tx: any) => void
}

export function SendModal({ isOpen, onClose, onTransactionSent }: SendModalProps) {
  const { address } = useAccount()
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSend = async () => {
    if (!address) {
      setError('Wallet not connected')
      return
    }

    if (!recipient || !amount) {
      setError('Please fill in all fields')
      return
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Please enter a valid amount')
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const transaction = await transactionService.sendTransaction(recipient, amount)
      
      if (transaction.status === 'failed') {
        setError('Transaction failed')
      } else {
        setSuccess(true)
        onTransactionSent?.(transaction)
        
        // Reset form
        setRecipient('')
        setAmount('')
        
        // Close modal after success
        setTimeout(() => {
          onClose()
          setSuccess(false)
        }, 2000)
      }
    } catch (err: any) {
      console.error('Send transaction error:', err)
      setError(err.message || 'Transaction failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setRecipient('')
    setAmount('')
    setError(null)
    setSuccess(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Send KDA</h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {success && (
            <div className="flex items-center gap-3 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-green-400">Transaction sent successfully!</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <span className="text-red-400">{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="recipient" className="block text-sm font-medium text-gray-400 mb-2">
              Recipient Address
            </label>
            <input
              type="text"
              id="recipient"
              className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:ring-kadena-500 focus:border-kadena-500"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-400 mb-2">
              Amount (KDA)
            </label>
            <input
              type="number"
              id="amount"
              step="0.000001"
              min="0"
              className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:ring-kadena-500 focus:border-kadena-500"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {amount && !isNaN(Number(amount)) && Number(amount) > 0 && (
            <div className="p-3 bg-gray-700/30 rounded-lg">
              <div className="text-sm text-gray-400">Transaction Summary</div>
              <div className="text-white font-medium">
                {amount} KDA ≈ ${(Number(amount) * 1900).toFixed(2)} USD
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Gas: ~0.001 KDA
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-700">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={isLoading || !recipient || !amount || isNaN(Number(amount)) || Number(amount) <= 0}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-kadena-500 to-kadena-600 hover:from-kadena-600 hover:to-kadena-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send KDA
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
