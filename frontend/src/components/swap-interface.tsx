'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { contractUtils } from '@/lib/contracts'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card } from './ui/card'
import { ArrowUpDown, Zap, Coins } from 'lucide-react'

export function SwapInterface() {
  const { address, isConnected } = useAccount()
  const [kdaAmount, setKdaAmount] = useState('')
  const [tokenAmount, setTokenAmount] = useState('')
  const [swapRate, setSwapRate] = useState<bigint>(0n)
  const [loading, setLoading] = useState(false)
  const [isSwapping, setIsSwapping] = useState(false)

  useEffect(() => {
    if (isConnected) {
      loadSwapRate()
    }
  }, [isConnected])

  const loadSwapRate = async () => {
    try {
      const rate = await contractUtils.getSwapRate()
      setSwapRate(rate)
    } catch (error) {
      console.error('Error loading swap rate:', error)
    }
  }

  const handleKdaAmountChange = async (value: string) => {
    setKdaAmount(value)
    if (value && swapRate > 0n) {
      try {
        const kdaAmountBigInt = BigInt(Math.floor(parseFloat(value) * 1e18))
        const quote = await contractUtils.getSwapQuote(kdaAmountBigInt)
        const tokenAmountFormatted = (Number(quote) / 1e18).toFixed(6)
        setTokenAmount(tokenAmountFormatted)
      } catch (error) {
        console.error('Error getting swap quote:', error)
      }
    } else {
      setTokenAmount('')
    }
  }

  const handleTokenAmountChange = (value: string) => {
    setTokenAmount(value)
    if (value && swapRate > 0n) {
      const tokenAmountBigInt = BigInt(Math.floor(parseFloat(value) * 1e18))
      const kdaAmountFormatted = (Number(tokenAmountBigInt) / Number(swapRate)).toFixed(6)
      setKdaAmount(kdaAmountFormatted)
    } else {
      setKdaAmount('')
    }
  }

  const handleSwap = async () => {
    if (!isConnected || !address || !kdaAmount) return

    setIsSwapping(true)
    setLoading(true)

    try {
      const kdaAmountBigInt = BigInt(Math.floor(parseFloat(kdaAmount) * 1e18))
      const hash = await contractUtils.swapKDAForTokens(kdaAmountBigInt)
      
      console.log('Swap transaction hash:', hash)
      alert(`Swap successful! Transaction hash: ${hash}`)
      
      // Reset form
      setKdaAmount('')
      setTokenAmount('')
    } catch (error) {
      console.error('Swap failed:', error)
      alert(`Swap failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSwapping(false)
      setLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <Coins className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Connect Wallet to Swap</h3>
          <p className="text-gray-500">Connect your wallet to start swapping tokens</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <Zap className="h-5 w-5 text-kadena-400" />
          <h3 className="text-lg font-semibold">Token Swap</h3>
        </div>

        {/* Swap Rate Display */}
        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
          <div className="text-sm text-gray-400 mb-1">Current Rate</div>
          <div className="text-lg font-semibold text-white">
            1 KDA = {(Number(swapRate) / 1e18).toFixed(2)} AIDT
          </div>
        </div>

        {/* KDA Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">From (KDA)</label>
          <div className="relative">
            <Input
              type="number"
              placeholder="0.0"
              value={kdaAmount}
              onChange={(e) => handleKdaAmountChange(e.target.value)}
              className="pr-16"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-medium text-gray-400">
              KDA
            </div>
          </div>
        </div>

        {/* Swap Arrow */}
        <div className="flex justify-center">
          <div className="p-2 bg-gray-800/50 rounded-full border border-gray-700/50">
            <ArrowUpDown className="h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Token Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">To (AIDT)</label>
          <div className="relative">
            <Input
              type="number"
              placeholder="0.0"
              value={tokenAmount}
              onChange={(e) => handleTokenAmountChange(e.target.value)}
              className="pr-16"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-medium text-gray-400">
              AIDT
            </div>
          </div>
        </div>

        {/* Swap Button */}
        <Button
          onClick={handleSwap}
          disabled={!kdaAmount || !tokenAmount || isSwapping || loading}
          className="w-full bg-gradient-to-r from-kadena-500 to-kadena-600 hover:from-kadena-600 hover:to-kadena-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
        >
          {isSwapping ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Swapping...
            </div>
          ) : (
            'Swap Tokens'
          )}
        </Button>

        {/* Info */}
        <div className="text-xs text-gray-500 text-center">
          <p>Swap KDA for AI DeFi Test Tokens (AIDT)</p>
          <p>Rate: 1 KDA = {(Number(swapRate) / 1e18).toFixed(2)} AIDT</p>
        </div>
      </div>
    </Card>
  )
}
