'use client'

import { useAccount, useBalance } from 'wagmi'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Wallet, Coins, Network } from 'lucide-react'

export function WalletStatus() {
  const { address, isConnected, chain } = useAccount()
  const { data: balance } = useBalance({
    address: address,
  })

  if (!isConnected || !address) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-lg">
              <Wallet className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Wallet Not Connected</p>
              <p className="text-xs text-muted-foreground">
                Connect your wallet to start chatting
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Connected</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {chain?.name || 'Unknown Network'}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Network className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
            </div>
            
            {balance && (
              <div className="flex items-center gap-2">
                <Coins className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
