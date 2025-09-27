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

// Deployed contract addresses on Kadena Chainweb EVM Testnet
export const CONTRACT_ADDRESSES = {
  AI_DELEGATE: '0x6a831d7e1d06dfa8eeF1ba1b996588995CB26789',
  MOCK_TOKEN: '0x0299Dc0b031f365b884d645F1b38420C6b0E0270',
  SIMPLE_SWAP: '0x7E48ce740412515d2408C74e0307ddA698aAb13b',
  CROSS_CHAIN_BRIDGE: '0xa64D7fa2579B5A5e2bC581D89e8D0e9e5467B945',
} as const

export const config = getDefaultConfig({
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