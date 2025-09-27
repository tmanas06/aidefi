'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { kadenaExplorer } from '@/lib/kadena-explorer'
import { 
  Wallet, 
  RefreshCw, 
  ExternalLink, 
  Copy, 
  CheckCircle,
  TrendingUp,
  Activity
} from 'lucide-react'

interface WalletBalanceProps {
  address: string
  className?: string
}

export function WalletBalance({ address, className }: WalletBalanceProps) {
  const [balance, setBalance] = useState<string>('0')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const fetchBalance = async () => {
    if (!address) return
    
    setLoading(true)
    try {
      const balanceData = await kadenaExplorer.getAccountBalance(address)
      setBalance(balanceData)
    } catch (error) {
      console.error('Error fetching balance:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBalance()
  }, [address])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatBalance = (balance: string) => {
    const num = parseFloat(balance)
    if (num === 0) return '0.000000'
    if (num < 0.000001) return '< 0.000001'
    return num.toFixed(6)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <Wallet className="h-5 w-5 text-kadena-400" />
            Wallet Balance
          </CardTitle>
          <Button
            onClick={fetchBalance}
            disabled={loading}
            size="sm"
            variant="outline"
            className="text-white border-gray-600 hover:bg-gray-700"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Balance Display */}
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {formatBalance(balance)} KDA
            </div>
            <div className="text-sm text-gray-400">
              ≈ ${(parseFloat(balance) * 0.1).toFixed(2)} USD
            </div>
          </div>

          {/* Address Display */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-1">Wallet Address</div>
                <div className="text-white font-mono text-sm">
                  {formatAddress(address)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyToClipboard}
                  className="text-gray-400 hover:text-white border-gray-600"
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(kadenaExplorer.getAddressUrl(address), '_blank')}
                  className="text-gray-400 hover:text-white border-gray-600"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Network Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="h-4 w-4 text-green-400" />
                <span className="text-sm text-gray-400">Network</span>
              </div>
              <div className="text-white font-medium">Kadena EVM Testnet</div>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-400">Chain ID</span>
              </div>
              <div className="text-white font-medium">5920</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-2">
            <div className="text-sm text-gray-400 mb-2">Quick Actions</div>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-kadena-500 hover:bg-kadena-600 text-white flex-1"
                onClick={() => window.open('https://tools.kadena.io/faucet/evm', '_blank')}
              >
                Get Test KDA
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-white border-gray-600 hover:bg-gray-700 flex-1"
                onClick={() => window.open(kadenaExplorer.getAddressUrl(address), '_blank')}
              >
                View on Explorer
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
