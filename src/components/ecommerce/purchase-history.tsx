"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAccount } from 'wagmi'
import { ExternalLink, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react'
import { getRPCConfig } from '@/lib/rpc-config'

interface PurchaseRecord {
  id: string
  productId: string | number
  productName: string
  amount: number
  currency: string
  txHash: string
  status: 'pending' | 'success' | 'failed'
  timestamp: number
  chainId: number
}

export function PurchaseHistory() {
  const { address, isConnected } = useAccount()
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([])
  const [loading, setLoading] = useState(false)

  // Load purchase history from localStorage
  useEffect(() => {
    if (isConnected && address) {
      loadPurchaseHistory()
    }
  }, [isConnected, address])

  const loadPurchaseHistory = () => {
    try {
      const key = `purchases_${address}`
      const stored = localStorage.getItem(key)
      if (stored) {
        const parsed = JSON.parse(stored)
        setPurchases(parsed.sort((a: PurchaseRecord, b: PurchaseRecord) => b.timestamp - a.timestamp))
      }
    } catch (error) {
      console.error('Error loading purchase history:', error)
    }
  }

  const addPurchase = (purchase: PurchaseRecord) => {
    if (!address) return

    const key = `purchases_${address}`
    const newPurchases = [purchase, ...purchases]
    setPurchases(newPurchases)
    
    try {
      localStorage.setItem(key, JSON.stringify(newPurchases))
    } catch (error) {
      console.error('Error saving purchase history:', error)
    }
  }

  const updatePurchaseStatus = (txHash: string, status: 'success' | 'failed') => {
    if (!address) return

    const updatedPurchases = purchases.map(purchase => 
      purchase.txHash === txHash ? { ...purchase, status } : purchase
    )
    setPurchases(updatedPurchases)

    try {
      const key = `purchases_${address}`
      localStorage.setItem(key, JSON.stringify(updatedPurchases))
    } catch (error) {
      console.error('Error updating purchase status:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const getExplorerUrl = (txHash: string, chainId: number) => {
    const config = getRPCConfig(chainId)
    if (config?.explorerUrl) {
      return `${config.explorerUrl}/tx/${txHash}`
    }
    return null
  }

  const clearHistory = () => {
    if (!address) return

    setPurchases([])
    try {
      const key = `purchases_${address}`
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Error clearing purchase history:', error)
    }
  }

  // Expose methods for parent components
  useEffect(() => {
    // Store methods on window for external access
    if (typeof window !== 'undefined') {
      (window as any).purchaseHistory = {
        addPurchase,
        updatePurchaseStatus
      }
    }
  }, [address])

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Purchase History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Connect your wallet to view purchase history
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Purchase History</CardTitle>
          {purchases.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearHistory}
            >
              Clear History
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {purchases.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No purchases yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Your purchase history will appear here after you make your first purchase
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {purchases.map((purchase) => (
              <div
                key={purchase.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(purchase.status)}
                  <div>
                    <p className="font-medium">{purchase.productName}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatTimestamp(purchase.timestamp)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-medium">
                      {purchase.amount / 10**18} {purchase.currency}
                    </p>
                    {getStatusBadge(purchase.status)}
                  </div>

                  {getExplorerUrl(purchase.txHash, purchase.chainId) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const url = getExplorerUrl(purchase.txHash, purchase.chainId)
                        if (url) window.open(url, '_blank')
                      }}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
