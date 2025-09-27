'use client'

import { OverviewCards } from '@/components/dashboard/overview-cards'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'
import { AgentStatus } from '@/components/dashboard/agent-status'
import { WalletConnect } from '@/components/wallet-connect'
import { 
  TrendingUp, 
  Activity, 
  Bot, 
  ArrowUpRight,
  Zap,
  Shield,
  Clock
} from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-green-400 font-medium">Live</span>
            </div>
          </div>
          <WalletConnect />
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-6 space-y-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-kadena-500/10 to-purple-500/10 rounded-2xl p-8 border border-kadena-500/20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Welcome to AI DeFi
                </h2>
                <p className="text-gray-300 text-lg mb-4">
                  Your intelligent DeFi platform powered by Kadena Chainweb EVM
                </p>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-kadena-400" />
                    <span className="text-sm text-gray-300">Secure Delegated Accounts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-purple-400" />
                    <span className="text-sm text-gray-300">AI-Powered Trading</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    <span className="text-sm text-gray-300">Lightning Fast</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-32 h-32 bg-gradient-to-r from-kadena-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                  <Zap className="h-16 w-16 text-kadena-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Overview Cards */}
          <OverviewCards />

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Transactions */}
            <div className="lg:col-span-2">
              <RecentTransactions />
            </div>

            {/* AI Agents */}
            <div className="lg:col-span-1">
              <AgentStatus />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-2xl p-6 border border-gray-600/30">
            <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="group flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-kadena-500/20 to-kadena-600/20 hover:from-kadena-500/30 hover:to-kadena-600/30 border border-kadena-500/30 hover:border-kadena-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-kadena-500/10">
                <div className="p-2 rounded-lg bg-kadena-500/20">
                  <Bot className="h-5 w-5 text-kadena-400" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-white">Create AI Agent</div>
                  <div className="text-sm text-gray-400">Deploy new trading bot</div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-kadena-400 ml-auto group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>

              <button className="group flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-purple-600/20 hover:from-purple-500/30 hover:to-purple-600/30 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Activity className="h-5 w-5 text-purple-400" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-white">View Analytics</div>
                  <div className="text-sm text-gray-400">Performance insights</div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-purple-400 ml-auto group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>

              <button className="group flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-green-600/20 hover:from-green-500/30 hover:to-green-600/30 border border-green-500/30 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-white">Start Trading</div>
                  <div className="text-sm text-gray-400">Execute trades now</div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-green-400 ml-auto group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}