'use client'

import { Sidebar } from '@/components/sidebar'
import { WalletConnect } from '@/components/wallet-connect'
import { OverviewCards } from '@/components/dashboard/overview-cards'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'
import { AgentStatus } from '@/components/dashboard/agent-status'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Sidebar />
      
      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="bg-gray-900/50 border-b border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-gray-400">Welcome to your DeFi control center</p>
            </div>
            <WalletConnect />
          </div>
        </header>

        {/* Main content area */}
        <main className="p-6">
          <div className="space-y-8">
            {/* Overview Cards */}
            <OverviewCards />

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <RecentTransactions />
              <AgentStatus />
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg hover:from-cyan-500/30 hover:to-blue-500/30 transition-all duration-300">
                  <div className="text-white font-medium">Send Payment</div>
                  <div className="text-sm text-gray-400">Send tokens via x402</div>
                </button>
                <button className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300">
                  <div className="text-white font-medium">Verify Identity</div>
                  <div className="text-sm text-gray-400">Self Protocol verification</div>
                </button>
                <button className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-300">
                  <div className="text-white font-medium">Agent Chat</div>
                  <div className="text-sm text-gray-400">Talk to your AI agents</div>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}