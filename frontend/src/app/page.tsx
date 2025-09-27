'use client'

import { OverviewCards } from '@/components/dashboard/overview-cards'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'
import { AgentStatus } from '@/components/dashboard/agent-status'
import { TransactionHistory } from '@/components/transaction-history'
import { WalletBalance } from '@/components/wallet-balance'
import { MainLayout } from '@/components/layout/main-layout'
import { ModernCard, ModernCardContent, ModernCardHeader, ModernCardTitle } from '@/components/ui/modern-card'
import { ModernButton } from '@/components/ui/modern-button'
import { useAccount } from 'wagmi'
import { 
  TrendingUp, 
  Activity, 
  Bot, 
  ArrowUpRight,
  Zap,
  Shield,
  Clock,
  Sparkles,
  Target,
  Rocket
} from 'lucide-react'

export default function Dashboard() {
  const { address, isConnected } = useAccount()

  return (
    <MainLayout title="Dashboard" subtitle="AI-Powered DeFi Platform">
      <div className="p-6 space-y-8">
        {/* Welcome Section */}
        <ModernCard variant="gradient" glow className="overflow-hidden">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-kadena-500/10 to-purple-500/10" />
            <div className="relative p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-kadena-500 to-purple-500">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-4xl font-bold text-white">
                        Welcome to AI DeFi
                      </h2>
                      <p className="text-xl text-gray-300">
                        Your intelligent DeFi platform powered by Kadena Chainweb EVM
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-kadena-500/20 border border-kadena-500/30">
                      <Shield className="h-4 w-4 text-kadena-400" />
                      <span className="text-sm text-kadena-300 font-medium">Secure Delegated Accounts</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30">
                      <Bot className="h-4 w-4 text-purple-400" />
                      <span className="text-sm text-purple-300 font-medium">AI-Powered Trading</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/20 border border-yellow-500/30">
                      <Zap className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-yellow-300 font-medium">Lightning Fast</span>
                    </div>
                  </div>
                </div>
                
                <div className="hidden lg:block">
                  <div className="w-40 h-40 bg-gradient-to-r from-kadena-500/20 to-purple-500/20 rounded-full flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-kadena-500/30 to-purple-500/30 rounded-full animate-pulse" />
                    <Rocket className="h-20 w-20 text-kadena-400 relative z-10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ModernCard>

        {/* Overview Cards */}
        <OverviewCards />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Transactions or Wallet Balance */}
          <div className="lg:col-span-2">
            {isConnected && address ? (
              <WalletBalance address={address} />
            ) : (
              <RecentTransactions />
            )}
          </div>

          {/* AI Agents */}
          <div className="lg:col-span-1">
            <AgentStatus />
          </div>
        </div>

        {/* Transaction History - Only show when connected */}
        {isConnected && address && (
          <TransactionHistory address={address} />
        )}

        {/* Quick Actions */}
        <ModernCard variant="elevated" className="overflow-hidden">
          <ModernCardHeader>
            <ModernCardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-kadena-400" />
              Quick Actions
            </ModernCardTitle>
          </ModernCardHeader>
          <ModernCardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button className="group w-full h-auto p-6 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 flex-col items-start text-left">
                <div className="flex items-center gap-3 w-full mb-3">
                  <div className="p-2 rounded-lg bg-kadena-500/20">
                    <Bot className="h-6 w-6 text-kadena-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-lg">Create AI Agent</div>
                    <div className="text-sm opacity-90">Deploy new trading bot</div>
                  </div>
                  <ArrowUpRight className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
                <div className="text-sm opacity-75">
                  Set up automated trading strategies with AI-powered decision making
                </div>
              </button>

              <button className="group w-full h-auto p-6 rounded-lg border border-gray-600 bg-transparent text-gray-300 hover:bg-gray-700/50 hover:border-purple-500/50 hover:text-white shadow-lg hover:shadow-xl transition-all duration-300 flex-col items-start text-left">
                <div className="flex items-center gap-3 w-full mb-3">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <Activity className="h-6 w-6 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-lg">View Analytics</div>
                    <div className="text-sm opacity-90">Performance insights</div>
                  </div>
                  <ArrowUpRight className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
                <div className="text-sm opacity-75">
                  Analyze trading performance and optimize your strategies
                </div>
              </button>

              <button className="group w-full h-auto p-6 rounded-lg bg-gradient-to-r from-kadena-500 to-kadena-600 text-white hover:from-kadena-600 hover:to-kadena-700 shadow-lg hover:shadow-xl hover:shadow-kadena-500/25 transition-all duration-300 flex-col items-start text-left">
                <div className="flex items-center gap-3 w-full mb-3">
                  <div className="p-2 rounded-lg bg-green-500/20">
                    <TrendingUp className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-lg">Start Trading</div>
                    <div className="text-sm opacity-90">Execute trades now</div>
                  </div>
                  <ArrowUpRight className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
                <div className="text-sm opacity-75">
                  Begin trading with real-time market data and AI assistance
                </div>
              </button>
            </div>
          </ModernCardContent>
        </ModernCard>
      </div>
    </MainLayout>
  )
}