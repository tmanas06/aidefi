'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PortfolioSummaryComponent } from './portfolio-summary'
import { NFTGallery } from './nft-gallery'
import { TransactionHistory } from './transaction-history'
import { PortfolioChart } from './portfolio-chart'
import { analyticsService, PortfolioSummary } from '@/lib/analytics-service'
import { ClientOnly } from '@/components/ui/client-only'
import { Search, RefreshCw, Download, Share2 } from 'lucide-react'

export function AnalyticsDashboard() {
  const { address, isConnected } = useAccount()
  const [inputAddress, setInputAddress] = useState('')
  const [currentAddress, setCurrentAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummary | null>(null)
  const [portfolioHistory, setPortfolioHistory] = useState<Array<{date: string, value: number}>>([])

  // Use connected wallet address as default
  useEffect(() => {
    if (isConnected && address && !currentAddress) {
      setInputAddress(address)
      setCurrentAddress(address)
      // Delay fetch to prevent hydration issues
      setTimeout(() => fetchPortfolioData(address), 100)
    }
  }, [isConnected, address, currentAddress])

  const fetchPortfolioData = async (address: string) => {
    if (!address) return

    setLoading(true)
    setError(null)

    try {
      const [summary, history] = await Promise.all([
        analyticsService.getPortfolioSummary(address),
        analyticsService.getPortfolioHistory(address, 30)
      ])

      setPortfolioSummary(summary)
      setPortfolioHistory(history)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch portfolio data')
    } finally {
      setLoading(false)
    }
  }

  const handleAddressSubmit = () => {
    if (inputAddress.trim()) {
      setCurrentAddress(inputAddress.trim())
      fetchPortfolioData(inputAddress.trim())
    }
  }

  const handleRefresh = () => {
    if (currentAddress) {
      analyticsService.clearCache()
      fetchPortfolioData(currentAddress)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Portfolio Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive analysis of wallet portfolio, NFTs, and transaction history
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Address Input */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter wallet address (0x...)"
                  value={inputAddress}
                  onChange={(e) => setInputAddress(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddressSubmit()}
                />
              </div>
            </div>
            <Button onClick={handleAddressSubmit} disabled={loading || !inputAddress.trim()}>
              Analyze Portfolio
            </Button>
          </div>
          
          {currentAddress && (
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Analyzing:</span>
              <Badge variant="outline" className="font-mono">
                {formatAddress(currentAddress)}
              </Badge>
              {isConnected && address === currentAddress && (
                <Badge variant="default">Your Wallet</Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="p-4">
            <p className="text-destructive text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Analytics Content */}
      {currentAddress && (
        <ClientOnly>
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="nfts">NFTs</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="charts">Charts</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <PortfolioSummaryComponent 
                summary={portfolioSummary!} 
                loading={loading} 
              />
            </TabsContent>

            <TabsContent value="nfts" className="space-y-6">
              <NFTGallery 
                nfts={portfolioSummary?.nftCount ? [] : []} // This would be populated from the service
                loading={loading} 
              />
            </TabsContent>

            <TabsContent value="transactions" className="space-y-6">
              <TransactionHistory 
                transactions={portfolioSummary?.recentTransactions || []} 
                loading={loading} 
              />
            </TabsContent>

            <TabsContent value="charts" className="space-y-6">
              <PortfolioChart 
                portfolioHistory={portfolioHistory}
                portfolioAllocation={portfolioSummary?.portfolioAllocation || []}
                loading={loading}
              />
            </TabsContent>
          </Tabs>
        </ClientOnly>
      )}

      {/* Empty State */}
      {!currentAddress && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Analyze Any Wallet</h3>
              <p className="text-muted-foreground mb-6">
                Enter a wallet address to view comprehensive portfolio analytics, 
                including token balances, NFTs, transaction history, and performance charts.
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Token balances and values</p>
                <p>• NFT collection overview</p>
                <p>• Transaction history</p>
                <p>• Portfolio performance charts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
