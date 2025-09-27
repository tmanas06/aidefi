"use client"

import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Product, PaymentRequest } from '@/lib/merchant-service'
import { useAccount, useWriteContract } from 'wagmi'
import { parseUnits } from 'viem'
import { ShoppingCart, CreditCard, Loader2 } from 'lucide-react'

interface ProductCardProps {
  product: Product
  onPurchaseStart?: (product: Product) => void
  onPurchaseComplete?: (result: { success: boolean; txHash?: string; message: string }) => void
}

export function ProductCard({ product, onPurchaseStart, onPurchaseComplete }: ProductCardProps) {
  const { address, isConnected } = useAccount()
  const { writeContract, isPending } = useWriteContract()
  const [loading, setLoading] = useState(false)
  const [paymentInfo, setPaymentInfo] = useState<PaymentRequest | null>(null)

  const formatPrice = () => {
    if (product.price_tokens) {
      return `${product.price_tokens} ${product.currency || 'rUSDT'}`
    } else if (product.price_usd) {
      return `$${product.price_usd.toFixed(2)}`
    }
    return 'Price not available'
  }

  const handlePurchase = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first')
      return
    }

    if (!address) {
      alert('Wallet address not available')
      return
    }

    // Check if this is a marketplace product
    if (product.marketplace) {
      // For marketplace products, redirect to the official marketplace
      if (product.marketplaceUrl) {
        window.open(product.marketplaceUrl, '_blank')
        onPurchaseComplete?.({
          success: true,
          message: `Redirecting to ${product.marketplace} to complete purchase`
        })
        return
      }
    }

    setLoading(true)
    onPurchaseStart?.(product)

    try {
      // Import merchant service dynamically to avoid SSR issues
      const { merchantService } = await import('@/lib/merchant-service')
      
      // Initiate purchase with merchant
      const paymentRequest = await merchantService.initiatePurchase(product.id)
      setPaymentInfo(paymentRequest)

      if (paymentRequest.status === '402 Payment Required') {
        // Execute the token transfer
        await executeTokenTransfer(paymentRequest)
      } else {
        throw new Error('Unexpected payment response')
      }
    } catch (error) {
      console.error('Purchase failed:', error)
      onPurchaseComplete?.({
        success: false,
        message: `Purchase failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      })
    } finally {
      setLoading(false)
    }
  }

  const executeTokenTransfer = async (paymentInfo: PaymentRequest) => {
    try {
      // Write contract to transfer tokens
      writeContract({
        address: paymentInfo.token_address as `0x${string}`,
        abi: [
          {
            name: 'transfer',
            type: 'function',
            stateMutability: 'nonpayable',
            inputs: [
              { name: 'to', type: 'address' },
              { name: 'amount', type: 'uint256' }
            ],
            outputs: [{ name: '', type: 'bool' }]
          }
        ],
        functionName: 'transfer',
        args: [
          paymentInfo.recipient_address as `0x${string}`,
          BigInt(paymentInfo.amount)
        ]
      }, {
        onSuccess: async (txHash) => {
          console.log('Transaction successful:', txHash)
          
          // Verify payment with merchant
          try {
            const { merchantService } = await import('@/lib/merchant-service')
            const verification = await merchantService.verifyPayment(txHash, paymentInfo.amount)
            
            onPurchaseComplete?.({
              success: verification.status === 'success',
              txHash,
              message: verification.message
            })
          } catch (error) {
            console.error('Payment verification failed:', error)
            onPurchaseComplete?.({
              success: false,
              txHash,
              message: `Payment sent but verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            })
          }
        },
        onError: (error) => {
          console.error('Transaction failed:', error)
          onPurchaseComplete?.({
            success: false,
            message: `Transaction failed: ${error.message}`
          })
        }
      })
    } catch (error) {
      console.error('Token transfer failed:', error)
      onPurchaseComplete?.({
        success: false,
        message: `Token transfer failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      })
    }
  }

  const getCategoryColor = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'electronics':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'clothing':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'art':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
      case 'digital':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'merchandise':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader className="pb-4">
        <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-4">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <ShoppingCart className="h-16 w-16 text-muted-foreground" />
          )}
        </div>
        
        <CardTitle className="text-lg font-semibold line-clamp-2">
          {product.name}
        </CardTitle>
        
        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="pb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-primary">
            {formatPrice()}
          </span>
          
          <div className="flex items-center gap-2">
            {product.category && (
              <Badge className={getCategoryColor(product.category)}>
                {product.category}
              </Badge>
            )}
            {product.marketplace && (
              <Badge variant="outline" className="text-xs">
                {product.marketplace}
              </Badge>
            )}
            {product.verified && (
              <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                ✓ Verified
              </Badge>
            )}
          </div>
        </div>

        {paymentInfo && (
          <div className="bg-muted p-3 rounded-lg mb-3">
            <p className="text-sm font-medium mb-1">Payment Details:</p>
            <p className="text-xs text-muted-foreground">
              Chain: {paymentInfo.chain}
            </p>
            <p className="text-xs text-muted-foreground">
              Amount: {paymentInfo.amount / 10**18} {paymentInfo.currency}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button 
          onClick={handlePurchase}
          disabled={loading || isPending || !isConnected}
          className="w-full"
        >
          {loading || isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              {product.marketplace 
                ? `Buy on ${product.marketplace}` 
                : isConnected ? 'Purchase' : 'Connect Wallet'}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
