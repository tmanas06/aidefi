'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { Wallet, TrendingUp, Activity, Users, DollarSign } from 'lucide-react'
import { SimpleWalletConnect } from '@/components/simple-wallet-connect'

interface AnalyticsData {
  period: string
  transactions: {
    totalVolume: number
    successRate: number
    count: number
    completed: number
    failed: number
    pending: number
    dailyVolume: Array<{
      date: string
      volume: number
      count: number
    }>
  }
  agents: {
    total: number
    completed: number
    failed: number
    pending: number
  }
  identity: {
    total: number
    verified: number
    ageVerified: number
    countryVerified: number
    sanctionVerified: number
  }
  summary: {
    totalValue: number
    activeAgents: number
    verificationLevel: string
  }
}

export default function AnalyticsPage() {
  const { address, isConnected } = useAccount()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalyticsData = async (walletAddress: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`http://localhost:3001/api/analytics/dashboard/${walletAddress}?period=30d`)
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data')
      }
      const data = await response.json()
      setAnalyticsData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
      console.error('Analytics fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isConnected && address) {
      fetchAnalyticsData(address)
    }
  }, [isConnected, address])

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toFixed(2)
  }

  const formatKDA = (amount: number) => {
    return `${formatNumber(amount)} KDA`
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-white">Analytics</h1>
              <div className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-sm">
                Wallet Required
              </div>
            </div>
            <SimpleWalletConnect />
          </div>
        </header>

        <div className="flex">
          <div className="w-64 bg-gray-800/50 border-r border-gray-700/50 min-h-screen">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Navigation</h2>
              <nav className="space-y-2">
                <a href="/" className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg">Dashboard</a>
                <a href="/agents" className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg">AI Agents</a>
                <a href="/analytics" className="block px-3 py-2 text-kadena-400 bg-kadena-500/20 rounded-lg">Analytics</a>
                <a href="/payments" className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg">Payments</a>
              </nav>
            </div>
          </div>

          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-700/50 rounded-full flex items-center justify-center">
                  <Wallet className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
                <p className="text-gray-400 mb-6">Connect your wallet to view your analytics and transaction data</p>
                <SimpleWalletConnect />
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white">Analytics</h1>
            <div className={`px-3 py-1 rounded-full text-sm border ${
              analyticsData ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
            }`}>
              {analyticsData ? 'Live Data' : 'Loading...'}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-6 py-3 bg-kadena-500 hover:bg-kadena-600 text-white rounded-lg transition-colors">
              Export Data
            </button>
            <SimpleWalletConnect />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800/50 border-r border-gray-700/50 min-h-screen">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Navigation</h2>
            <nav className="space-y-2">
              <a href="/" className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg">Dashboard</a>
              <a href="/agents" className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg">AI Agents</a>
              <a href="/analytics" className="block px-3 py-2 text-kadena-400 bg-kadena-500/20 rounded-lg">Analytics</a>
              <a href="/payments" className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg">Payments</a>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-kadena-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-white text-lg">Loading analytics data...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full" />
                <span className="text-red-400 font-medium">Error loading data</span>
              </div>
              <p className="text-red-300 text-sm mt-1">{error}</p>
            </div>
          )}

          {analyticsData && (
            <div className="space-y-8">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-green-400" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-400">Total Volume</h3>
                  </div>
                  <p className="text-2xl font-bold text-white">{formatKDA(analyticsData.transactions.totalVolume)}</p>
                  <p className="text-sm text-green-400">{analyticsData.transactions.successRate.toFixed(1)}% success rate</p>
                </div>

                <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Activity className="h-5 w-5 text-blue-400" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-400">Total Transactions</h3>
                  </div>
                  <p className="text-2xl font-bold text-white">{analyticsData.transactions.count}</p>
                  <p className="text-sm text-blue-400">{analyticsData.transactions.completed} completed</p>
                </div>

                <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Users className="h-5 w-5 text-purple-400" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-400">Active Agents</h3>
                  </div>
                  <p className="text-2xl font-bold text-white">{analyticsData.agents.total}</p>
                  <p className="text-sm text-purple-400">{analyticsData.agents.completed} completed tasks</p>
                </div>

                <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-orange-500/20 rounded-lg">
                      <DollarSign className="h-5 w-5 text-orange-400" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-400">Avg Transaction</h3>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {analyticsData.transactions.count > 0 
                      ? formatKDA(analyticsData.transactions.totalVolume / analyticsData.transactions.count)
                      : '0 KDA'
                    }
                  </p>
                  <p className="text-sm text-orange-400">
                    {analyticsData.identity.verified > 0 ? 'Verified user' : 'Unverified'}
                  </p>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4">Volume Over Time (30 days)</h3>
                  <div className="h-64 bg-gray-700/50 rounded-lg p-4">
                    {analyticsData.transactions.dailyVolume.length > 0 ? (
                      <div className="space-y-2">
                        {analyticsData.transactions.dailyVolume.slice(-7).map((day, index) => (
                          <div key={day.date} className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">{day.date}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-600 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-kadena-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                                  style={{ 
                                    width: `${Math.min(100, (day.volume / Math.max(...analyticsData.transactions.dailyVolume.map(d => d.volume))) * 100)}%` 
                                  }}
                                />
                              </div>
                              <span className="text-sm text-white font-medium">{formatKDA(day.volume)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-400">No transaction data available</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4">Transaction Status</h3>
                  <div className="h-64 bg-gray-700/50 rounded-lg p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Completed</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-600 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full"
                              style={{ 
                                width: `${analyticsData.transactions.count > 0 ? (analyticsData.transactions.completed / analyticsData.transactions.count) * 100 : 0}%` 
                              }}
                            />
                          </div>
                          <span className="text-sm text-white font-medium">{analyticsData.transactions.completed}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Failed</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-600 rounded-full h-2">
                            <div 
                              className="bg-red-500 h-2 rounded-full"
                              style={{ 
                                width: `${analyticsData.transactions.count > 0 ? (analyticsData.transactions.failed / analyticsData.transactions.count) * 100 : 0}%` 
                              }}
                            />
                          </div>
                          <span className="text-sm text-white font-medium">{analyticsData.transactions.failed}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Pending</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-600 rounded-full h-2">
                            <div 
                              className="bg-yellow-500 h-2 rounded-full"
                              style={{ 
                                width: `${analyticsData.transactions.count > 0 ? (analyticsData.transactions.pending / analyticsData.transactions.count) * 100 : 0}%` 
                              }}
                            />
                          </div>
                          <span className="text-sm text-white font-medium">{analyticsData.transactions.pending}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}