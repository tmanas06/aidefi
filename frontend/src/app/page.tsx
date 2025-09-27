'use client'

import { SwapInterface } from '@/components/swap-interface'
import { WalletBalance } from '@/components/wallet-balance'
import { MetaMaskConnect } from '@/components/metamask-connect'
import { WalletInstructions } from '@/components/wallet-instructions'
import { WalletTest } from '@/components/wallet-test'
import { DebugInfo } from '@/components/debug-info'
import { MainLayout } from '@/components/layout/main-layout'
import { useAccount, useChainId } from 'wagmi'

export default function Dashboard() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const isKadenaNetwork = chainId === 5920
  return (
    <MainLayout title="Dashboard" subtitle="AI DeFi Platform">
      <div className="space-y-8">
                {/* Wallet Connection */}
                {!isConnected && (
                  <div className="mb-6">
                    <MetaMaskConnect />
                  </div>
                )}

                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-kadena-500/10 to-purple-500/10 rounded-2xl p-8 border border-kadena-500/20">
              <h2 className="text-3xl font-bold text-white mb-4">
                Welcome to AI DeFi
              </h2>
              <p className="text-gray-300 text-lg mb-6">
                Your intelligent DeFi platform powered by Kadena Chainweb EVM
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-kadena-500/20 border border-kadena-500/30">
                  <span className="text-sm text-kadena-300 font-medium">Secure Delegated Accounts</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30">
                  <span className="text-sm text-purple-300 font-medium">AI-Powered Trading</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/20 border border-yellow-500/30">
                  <span className="text-sm text-yellow-300 font-medium">Lightning Fast</span>
                </div>
              </div>
            </div>

                {/* Wallet and Swap Interface */}
                {isConnected && address && isKadenaNetwork && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <WalletBalance address={address} />
                    <SwapInterface />
                  </div>
                )}

                {/* Wallet Instructions for disconnected users */}
                {!isConnected && (
                  <div className="max-w-2xl mx-auto">
                    <WalletInstructions />
                  </div>
                )}

                {/* Wallet Test Component */}
                <div className="max-w-4xl mx-auto">
                  <WalletTest />
                </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Total Value Locked</h3>
                <p className="text-2xl font-bold text-white">Loading...</p>
                <p className="text-sm text-green-400">Connecting to network...</p>
              </div>
              <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Active Agents</h3>
                <p className="text-2xl font-bold text-white">Loading...</p>
                <p className="text-sm text-green-400">Fetching data...</p>
              </div>
              <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Total Transactions</h3>
                <p className="text-2xl font-bold text-white">Loading...</p>
                <p className="text-sm text-green-400">Calculating...</p>
              </div>
              <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <h3 className="text-sm font-medium text-gray-400 mb-2">AI Bot Performance</h3>
                <p className="text-2xl font-bold text-white">Loading...</p>
                <p className="text-sm text-red-400">Analyzing...</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 bg-gradient-to-r from-kadena-500/20 to-kadena-600/20 hover:from-kadena-500/30 hover:to-kadena-600/30 border border-kadena-500/30 rounded-lg text-left transition-all duration-300">
                  <h4 className="font-semibold text-white mb-2">Create AI Agent</h4>
                  <p className="text-sm text-gray-400">Deploy new trading bot</p>
                </button>
                <button className="p-4 bg-gradient-to-r from-purple-500/20 to-purple-600/20 hover:from-purple-500/30 hover:to-purple-600/30 border border-purple-500/30 rounded-lg text-left transition-all duration-300">
                  <h4 className="font-semibold text-white mb-2">View Analytics</h4>
                  <p className="text-sm text-gray-400">Performance insights</p>
                </button>
                <button className="p-4 bg-gradient-to-r from-green-500/20 to-green-600/20 hover:from-green-500/30 hover:to-green-600/30 border border-green-500/30 rounded-lg text-left transition-all duration-300">
                  <h4 className="font-semibold text-white mb-2">Start Trading</h4>
                  <p className="text-sm text-gray-400">Execute trades now</p>
                </button>
              </div>
            </div>
      </div>
      
      <DebugInfo />
    </MainLayout>
  )
}