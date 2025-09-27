'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, polygon, arbitrum, base, sepolia } from 'wagmi/chains'
import { http } from 'viem'
import { useState, useEffect } from 'react'

// Import RainbowKit styles
import '@rainbow-me/rainbowkit/styles.css'

// Kadena Chainweb EVM Testnet configuration
const kadenaTestnet = {
  id: 5920,
  name: 'Kadena Chainweb EVM Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Kadena',
    symbol: 'KDA',
  },
  rpcUrls: {
    default: {
      http: ['https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc'],
    },
    public: {
      http: ['https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Kadena EVM Testnet Explorer',
      url: 'http://chain-20.evm-testnet-blockscout.chainweb.com/',
    },
  },
  testnet: true,
}

const config = getDefaultConfig({
  appName: 'AI DeFi Kadena dApp',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id',
  chains: [kadenaTestnet, mainnet, polygon, arbitrum, base, sepolia],
  transports: {
    [kadenaTestnet.id]: http(),
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [sepolia.id]: http(),
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-kadena-500 border-t-transparent rounded-full animate-spin" />
          <div className="text-white text-lg">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          modalSize="compact"
          showRecentTransactions={true}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}