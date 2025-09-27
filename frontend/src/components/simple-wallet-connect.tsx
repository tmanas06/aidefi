'use client'

import { useState } from 'react'
import { Wallet, ChevronDown } from 'lucide-react'

export function SimpleWalletConnect() {
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState<string | null>(null)

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        })
        if (accounts.length > 0) {
          setAccount(accounts[0])
          setIsConnected(true)
        }
      } catch (error) {
        console.error('Failed to connect wallet:', error)
      }
    } else {
      alert('Please install MetaMask to use this application')
    }
  }

  const disconnectWallet = () => {
    setAccount(null)
    setIsConnected(false)
  }

  if (!isConnected) {
    return (
      <button
        onClick={connectWallet}
        className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-kadena-500 to-kadena-600 hover:from-kadena-600 hover:to-kadena-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-kadena-500/25 hover:-translate-y-0.5"
      >
        <Wallet className="h-5 w-5" />
        <span>Connect Wallet</span>
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-kadena-400 to-kadena-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      </button>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 text-white font-medium rounded-lg">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <span className="text-sm">Connected</span>
      </div>

      <button
        onClick={disconnectWallet}
        className="group relative inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-kadena-500 to-kadena-600 hover:from-kadena-600 hover:to-kadena-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-kadena-500/25 hover:-translate-y-0.5"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Wallet className="h-4 w-4" />
          </div>
          <div className="text-left">
            <div className="text-sm font-medium">
              {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connected'}
            </div>
          </div>
        </div>
        <ChevronDown className="h-4 w-4" />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-kadena-400 to-kadena-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      </button>
    </div>
  )
}
