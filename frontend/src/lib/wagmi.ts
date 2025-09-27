import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, polygon, arbitrum, base, sepolia } from 'wagmi/chains'
import { http } from 'viem'

// Kadena Chainweb EVM Testnet configuration
export const kadenaTestnet = {
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
} as const

export const config = getDefaultConfig({
  appName: 'AI DeFi Kadena dApp',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id',
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