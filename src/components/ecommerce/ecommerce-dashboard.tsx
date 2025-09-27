"use client"

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProductGrid } from './product-grid'
import { PurchaseHistory } from './purchase-history'
import { Product, merchantService } from '@/lib/merchant-service'
import { useAccount } from 'wagmi'
import { ShoppingBag, History, TrendingUp, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function EcommerceDashboard() {
  const { isConnected } = useAccount()
  const [recentPurchase, setRecentPurchase] = useState<{
    success: boolean
    txHash?: string
    message: string
    product?: Product
  } | null>(null)

  const handlePurchaseComplete = (result: {
    success: boolean
    txHash?: string
    message: string
    product?: Product
  }) => {
    setRecentPurchase(result)

    // Add to purchase history if successful
    if (result.success && result.txHash && result.product) {
      const purchaseRecord = {
        id: Date.now().toString(),
        productId: result.product.id,
        productName: result.product.name,
        amount: result.product.price_tokens ? result.product.price_tokens * 10**18 : 0,
        currency: result.product.currency || 'rUSDT',
        txHash: result.txHash,
        status: 'success' as const,
        timestamp: Date.now(),
        chainId: 31 // Rootstock testnet
      }

      // Add to purchase history via window method
      if (typeof window !== 'undefined' && (window as any).purchaseHistory) {
        (window as any).purchaseHistory.addPurchase(purchaseRecord)
      }
    }

    // Clear the notification after 5 seconds
    setTimeout(() => {
      setRecentPurchase(null)
    }, 5000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <ShoppingBag className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">E-Commerce Marketplace</h1>
          <p className="text-muted-foreground">
            Buy products using cryptocurrency on the blockchain
          </p>
        </div>
      </div>

      {/* Wallet Connection Alert */}
      {!isConnected && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please connect your wallet to make purchases. You can browse products without connecting, 
            but you'll need a wallet to complete transactions.
          </AlertDescription>
        </Alert>
      )}

      {/* Purchase Notification */}
      {recentPurchase && (
        <Alert variant={recentPurchase.success ? "default" : "destructive"}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span>
                {recentPurchase.success ? '✅ Purchase successful!' : '❌ Purchase failed!'}
                <br />
                {recentPurchase.message}
              </span>
              {recentPurchase.txHash && (
                <button
                  onClick={() => {
                    const url = `https://explorer.testnet.rsk.co/tx/${recentPurchase.txHash}`
                    window.open(url, '_blank')
                  }}
                  className="text-sm underline"
                >
                  View Transaction
                </button>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Products</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10+</div>
            <p className="text-xs text-muted-foreground">
              Various categories available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Supported Networks</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rootstock</div>
            <p className="text-xs text-muted-foreground">
              Testnet & Mainnet support
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">rUSDT</div>
            <p className="text-xs text-muted-foreground">
              ERC-20 token payments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="marketplace" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="marketplace" className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            Marketplace
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Purchase History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="marketplace" className="space-y-6">
          <ProductGrid onPurchaseComplete={handlePurchaseComplete} />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <PurchaseHistory />
        </TabsContent>
      </Tabs>

      {/* Footer Information */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">How it works:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Browse products in the marketplace</li>
                <li>Click "Purchase" on any item you want</li>
                <li>Connect your wallet if not already connected</li>
                <li>Approve the token transfer transaction</li>
                <li>Wait for transaction confirmation</li>
                <li>Your purchase will be verified automatically</li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Supported Features:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Real-time payment verification</li>
                <li>Transaction history tracking</li>
                <li>Multi-network support (Rootstock)</li>
                <li>ERC-20 token payments</li>
                <li>Automatic purchase confirmation</li>
                <li>Blockchain transaction links</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
