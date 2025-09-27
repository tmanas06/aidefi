import { createConfig, http } from 'wagmi'
import { 
  mainnet, 
  polygon, 
  optimism, 
  arbitrum, 
  sepolia,
  bsc,
  bscTestnet,
  avalanche,
  avalancheFuji,
  base,
  baseSepolia,
  fantom,
  fantomTestnet
} from 'wagmi/chains'
import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import {
  metaMaskWallet,
  walletConnectWallet,
  coinbaseWallet,
  rainbowWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { RPC_CONFIGS } from './rpc-config'

// Custom Rootstock chains (not included in wagmi/chains by default)
export const rootstock = {
  id: 30,
  name: 'Rootstock Mainnet',
  network: 'rootstock',
  nativeCurrency: {
    decimals: 18,
    name: 'Rootstock Bitcoin',
    symbol: 'RBTC',
  },
  rpcUrls: {
    default: {
      http: [RPC_CONFIGS.rootstock_mainnet.rpcUrl],
    },
    public: {
      http: [RPC_CONFIGS.rootstock_mainnet.rpcUrl],
    },
  },
  blockExplorers: {
    default: {
      name: 'Rootstock Explorer',
      url: RPC_CONFIGS.rootstock_mainnet.explorerUrl || 'https://explorer.rsk.co',
    },
  },
  testnet: false,
} as const

export const rootstockTestnet = {
  id: 31,
  name: 'Rootstock Testnet',
  network: 'rootstock-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Rootstock Bitcoin Testnet',
    symbol: 'tRBTC',
  },
  rpcUrls: {
    default: {
      http: [RPC_CONFIGS.rootstock_testnet.rpcUrl],
    },
    public: {
      http: [RPC_CONFIGS.rootstock_testnet.rpcUrl],
    },
  },
  blockExplorers: {
    default: {
      name: 'Rootstock Testnet Explorer',
      url: RPC_CONFIGS.rootstock_testnet.explorerUrl || 'https://explorer.testnet.rsk.co',
    },
  },
  testnet: true,
} as const

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [
        metaMaskWallet,
        walletConnectWallet,
        coinbaseWallet,
        rainbowWallet,
      ],
    },
  ],
  {
    appName: 'AgentChat',
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'demo-project-id',
  }
)

export const config = createConfig({
  chains: [
    // Ethereum networks
    mainnet, 
    sepolia,
    
    // Layer 2 networks
    polygon, 
    optimism, 
    arbitrum,
    base,
    baseSepolia,
    
    // Other EVM networks
    bsc,
    bscTestnet,
    avalanche,
    avalancheFuji,
    fantom,
    fantomTestnet,
    
    // Rootstock networks
    rootstock,
    rootstockTestnet,
  ],
  connectors,
  transports: {
    // Ethereum networks
    [mainnet.id]: http(RPC_CONFIGS.ethereum_mainnet.rpcUrl),
    [sepolia.id]: http(RPC_CONFIGS.ethereum_sepolia.rpcUrl),
    
    // Layer 2 networks
    [polygon.id]: http(RPC_CONFIGS.polygon_mainnet.rpcUrl),
    [optimism.id]: http(RPC_CONFIGS.optimism_mainnet.rpcUrl),
    [arbitrum.id]: http(RPC_CONFIGS.arbitrum_mainnet.rpcUrl),
    [base.id]: http(RPC_CONFIGS.base_mainnet.rpcUrl),
    [baseSepolia.id]: http(RPC_CONFIGS.base_sepolia.rpcUrl),
    
    // Other EVM networks
    [bsc.id]: http(RPC_CONFIGS.bsc_mainnet.rpcUrl),
    [bscTestnet.id]: http(RPC_CONFIGS.bsc_testnet.rpcUrl),
    [avalanche.id]: http(RPC_CONFIGS.avalanche_mainnet.rpcUrl),
    [avalancheFuji.id]: http(RPC_CONFIGS.avalanche_fuji.rpcUrl),
    [fantom.id]: http(RPC_CONFIGS.fantom_mainnet.rpcUrl),
    [fantomTestnet.id]: http(RPC_CONFIGS.fantom_testnet.rpcUrl),
    
    // Rootstock networks
    [rootstock.id]: http(RPC_CONFIGS.rootstock_mainnet.rpcUrl),
    [rootstockTestnet.id]: http(RPC_CONFIGS.rootstock_testnet.rpcUrl),
  },
  ssr: true,
})
