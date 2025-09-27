'use client'

import { ReactNode } from 'react'
import { Sidebar } from '@/components/sidebar'
import { useAccount } from 'wagmi'
import { Bot, Zap, Shield, Activity } from 'lucide-react'

interface MainLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
  showHeader?: boolean
}

export function MainLayout({ 
  children, 
  title, 
  subtitle, 
  showHeader = true 
}: MainLayoutProps) {
  const { address, isConnected } = useAccount()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      {showHeader && (
        <header className="glass-dark border-b border-gray-700/50 sticky top-0 z-50">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-r from-kadena-500 to-purple-500">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">AI DeFi</h1>
                  <p className="text-xs text-gray-400">Kadena dApp</p>
                </div>
              </div>
              
              {title && (
                <div className="hidden md:block">
                  <div className="h-8 w-px bg-gray-600 mx-4" />
                  <div>
                    <h2 className="text-lg font-semibold text-white">{title}</h2>
                    {subtitle && (
                      <p className="text-sm text-gray-400">{subtitle}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              {/* Status Indicators */}
              <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm text-green-400 font-medium">Live</span>
                </div>
                
                {isConnected && (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-kadena-500/20 border border-kadena-500/30">
                    <Shield className="h-3 w-3 text-kadena-400" />
                    <span className="text-sm text-kadena-400 font-medium">Connected</span>
                  </div>
                )}
              </div>
              
              {isConnected ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm text-green-400 font-medium">
                    {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connected'}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-600/20 border border-gray-600/30 rounded-lg">
                  <div className="w-2 h-2 bg-gray-400 rounded-full" />
                  <span className="text-sm text-gray-400 font-medium">Not Connected</span>
                </div>
              )}
            </div>
          </div>
        </header>
      )}

      <div className="flex">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}
