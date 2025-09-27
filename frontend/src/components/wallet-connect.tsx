'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Wallet, ChevronDown } from 'lucide-react'

export function WalletConnect() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading'
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated')

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-kadena-500 to-kadena-600 hover:from-kadena-600 hover:to-kadena-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-kadena-500/25 hover:-translate-y-0.5"
                  >
                    <Wallet className="h-5 w-5" />
                    <span>Connect Wallet</span>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-kadena-400 to-kadena-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  </button>
                )
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25 hover:-translate-y-0.5"
                  >
                    <Wallet className="h-5 w-5" />
                    <span>Wrong Network</span>
                    <ChevronDown className="h-4 w-4" />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-400 to-red-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  </button>
                )
              }

              return (
                <div className="flex items-center gap-3">
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="group relative inline-flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm">{chain.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="group relative inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-kadena-500 to-kadena-600 hover:from-kadena-600 hover:to-kadena-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-kadena-500/25 hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <Wallet className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium">
                          {account.displayName}
                        </div>
                        <div className="text-xs opacity-80">
                          {account.displayBalance ? ` ${account.displayBalance}` : ''}
                        </div>
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-kadena-400 to-kadena-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  </button>
                </div>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}