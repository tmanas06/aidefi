"use client"

import { useAccount, useChainId } from 'wagmi'
import { getRPCConfig } from '@/lib/rpc-config'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function NetworkInfo() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  
  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Network Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Connect your wallet to see network information</p>
        </CardContent>
      </Card>
    )
  }

  const networkConfig = getRPCConfig(chainId)
  
  if (!networkConfig) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Network Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Unknown network (Chain ID: {chainId})</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Network Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">Network:</span>
          <div className="flex items-center gap-2">
            <span>{networkConfig.name}</span>
            {networkConfig.testnet && (
              <Badge variant="secondary" className="text-xs">
                Testnet
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="font-medium">Chain ID:</span>
          <code className="text-sm bg-muted px-2 py-1 rounded">
            {networkConfig.chainId}
          </code>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="font-medium">Native Token:</span>
          <span>{networkConfig.nativeCurrency.symbol}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="font-medium">RPC URL:</span>
          <code className="text-xs bg-muted px-2 py-1 rounded max-w-[200px] truncate">
            {networkConfig.rpcUrl}
          </code>
        </div>
        
        {networkConfig.explorerUrl && (
          <div className="flex items-center justify-between">
            <span className="font-medium">Explorer:</span>
            <a 
              href={networkConfig.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm underline"
            >
              View Explorer
            </a>
          </div>
        )}
        
        {networkConfig.supportedFeatures && networkConfig.supportedFeatures.length > 0 && (
          <div>
            <span className="font-medium block mb-2">Supported Features:</span>
            <div className="flex flex-wrap gap-1">
              {networkConfig.supportedFeatures.map((feature) => (
                <Badge key={feature} variant="outline" className="text-xs">
                  {feature.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
