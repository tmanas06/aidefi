'use client'

import { Sidebar } from '@/components/sidebar'
import { WalletConnect } from '@/components/wallet-connect'
import { OverviewCards } from '@/components/dashboard/overview-cards'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'
import { AgentStatus } from '@/components/dashboard/agent-status'
import { 
  Zap, 
  Shield, 
  Bot, 
  TrendingUp, 
  Activity,
  ArrowRight,
  Star,
  Wallet,
  Settings
} from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Sidebar />
      
      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="glass-dark border-b border-gray-700/50 px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">DeFi Dashboard</h1>
                  <p className="text-gray-300">Advanced automation platform powered by Brewit.money</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">All Systems Online</span>
              </div>
              <WalletConnect />
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="p-6">
          <div className="space-y-8">
            {/* Features Showcase */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="glass-dark rounded-xl p-6 hover-lift glow">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Smart Wallets</h3>
                <p className="text-gray-400 text-sm">Delegated accounts with automated trading</p>
              </div>
              
              <div className="glass-dark rounded-xl p-6 hover-lift glow-purple">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Bot className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">AI Agents</h3>
                <p className="text-gray-400 text-sm">Intelligent automation for trading</p>
              </div>
              
              <div className="glass-dark rounded-xl p-6 hover-lift">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Secure</h3>
                <p className="text-gray-400 text-sm">Built-in identity verification</p>
              </div>
              
              <div className="glass-dark rounded-xl p-6 hover-lift">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Multi-Chain</h3>
                <p className="text-gray-400 text-sm">Polygon & Kadena support</p>
              </div>
            </div>

            {/* Overview Cards */}
            <OverviewCards />

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <RecentTransactions />
              <AgentStatus />
            </div>

            {/* Quick Actions */}
            <div className="glass-dark rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Activity className="h-6 w-6 text-blue-400" />
                <h2 className="text-2xl font-semibold text-white">Quick Actions</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button className="group p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl hover:from-cyan-500/20 hover:to-blue-500/20 transition-all duration-300 hover-lift">
                  <div className="flex items-center gap-3 mb-3">
                    <Wallet className="h-5 w-5 text-cyan-400" />
                    <div className="text-white font-semibold">Send Payment</div>
                  </div>
                  <div className="text-sm text-gray-400 group-hover:text-gray-300">Send tokens via x402 protocol</div>
                </button>
                
                <button className="group p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300 hover-lift">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="h-5 w-5 text-purple-400" />
                    <div className="text-white font-semibold">Verify Identity</div>
                  </div>
                  <div className="text-sm text-gray-400 group-hover:text-gray-300">Brewit.money verification</div>
                </button>
                
                <button className="group p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl hover:from-green-500/20 hover:to-emerald-500/20 transition-all duration-300 hover-lift">
                  <div className="flex items-center gap-3 mb-3">
                    <Bot className="h-5 w-5 text-green-400" />
                    <div className="text-white font-semibold">Agent Chat</div>
                  </div>
                  <div className="text-sm text-gray-400 group-hover:text-gray-300">Talk to your AI agents</div>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}