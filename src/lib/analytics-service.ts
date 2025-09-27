import { Alchemy, Network, NftTokenType } from 'alchemy-sdk'
import axios from 'axios'
import { RPC_CONFIGS, getRPCConfig } from './rpc-config'

// Types for portfolio data
export interface TokenBalance {
  contractAddress: string
  name: string
  symbol: string
  balance: string
  balanceFormatted: string
  decimals: number
  logo?: string
  price?: number
  valueUSD?: number
}

export interface NFT {
  tokenId: string
  name: string
  description?: string
  image?: string
  collectionName: string
  contractAddress: string
  floorPrice?: number
  lastSalePrice?: number
  rarity?: number
  traits?: Array<{
    trait_type: string
    value: string
    rarity?: number
  }>
}

export interface Transaction {
  hash: string
  from: string
  to: string
  value: string
  timestamp: number
  gasUsed: string
  gasPrice: string
  method?: string
  status: 'success' | 'failed'
  type: 'send' | 'receive' | 'contract'
}

export interface DeFiPosition {
  protocol: string
  type: 'lending' | 'borrowing' | 'liquidity' | 'staking'
  asset: string
  amount: string
  valueUSD: number
  apy?: number
  rewards?: number
}

export interface PortfolioSummary {
  totalValueUSD: number
  tokenCount: number
  nftCount: number
  transactionCount: number
  defiPositions: number
  topTokens: TokenBalance[]
  recentTransactions: Transaction[]
  portfolioAllocation: Array<{
    asset: string
    value: number
    percentage: number
  }>
}

// Analytics Service Configuration
const ALCHEMY_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || 'demo',
  network: Network.ETH_MAINNET,
}

// Initialize Alchemy
const alchemy = new Alchemy(ALCHEMY_CONFIG)

export class AnalyticsService {
  private cache: Map<string, any> = new Map()
  private cacheTimeout = 5 * 60 * 1000 // 5 minutes
  private currentChainId: number = 1 // Default to Ethereum mainnet
  private alchemyInstances: Map<number, Alchemy> = new Map()

  // Set the current chain for analytics
  setCurrentChain(chainId: number) {
    this.currentChainId = chainId
    this.initializeAlchemyForChain(chainId)
  }

  // Initialize Alchemy instance for specific chain
  private initializeAlchemyForChain(chainId: number) {
    if (this.alchemyInstances.has(chainId)) {
      return this.alchemyInstances.get(chainId)!
    }

    let network: Network
    let apiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || 'demo'

    switch (chainId) {
      case 1: // Ethereum Mainnet
        network = Network.ETH_MAINNET
        break
      case 11155111: // Ethereum Sepolia
        network = Network.ETH_SEPOLIA
        break
      case 137: // Polygon Mainnet
        network = Network.MATIC_MAINNET
        break
      case 80001: // Polygon Mumbai
        network = Network.MATIC_MUMBAI
        break
      case 42161: // Arbitrum Mainnet
        network = Network.ARB_MAINNET
        break
      case 421614: // Arbitrum Sepolia
        network = Network.ARB_SEPOLIA
        break
      case 10: // Optimism Mainnet
        network = Network.OPT_MAINNET
        break
      case 11155420: // Optimism Sepolia
        network = Network.OPT_SEPOLIA
        break
      case 8453: // Base Mainnet
        network = Network.BASE_MAINNET
        break
      case 84532: // Base Sepolia
        network = Network.BASE_SEPOLIA
        break
      default:
        // For unsupported chains, use Ethereum mainnet as fallback
        network = Network.ETH_MAINNET
        break
    }

    const alchemy = new Alchemy({
      apiKey,
      network,
    })

    this.alchemyInstances.set(chainId, alchemy)
    return alchemy
  }

  // Get Alchemy instance for current chain
  private getAlchemy(): Alchemy {
    if (!this.alchemyInstances.has(this.currentChainId)) {
      return this.initializeAlchemyForChain(this.currentChainId)
    }
    return this.alchemyInstances.get(this.currentChainId)!
  }

  // Get cached data or fetch new
  private async getCachedOrFetch<T>(
    key: string, 
    fetchFn: () => Promise<T>
  ): Promise<T> {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }

    const data = await fetchFn()
    this.cache.set(key, { data, timestamp: Date.now() })
    return data
  }

  // Get token balances for an address
  async getTokenBalances(address: string): Promise<TokenBalance[]> {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      return []
    }

    return this.getCachedOrFetch(`tokens-${address}-${this.currentChainId}`, async () => {
      try {
        // Check if we have a valid API key
        if (!process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || process.env.NEXT_PUBLIC_ALCHEMY_API_KEY === 'demo') {
          console.warn('No valid Alchemy API key provided, returning mock data')
          return this.getMockTokenBalances()
        }

        const alchemy = this.getAlchemy()
        const balances = await alchemy.core.getTokenBalances(address)
        
        const tokenBalances: TokenBalance[] = []
        
        for (const balance of balances.tokenBalances) {
          if (balance.tokenBalance === '0x0') continue
          
          try {
            const metadata = await alchemy.core.getTokenMetadata(balance.contractAddress)
            
            // Get price data (using CoinGecko API as fallback)
            const price = await this.getTokenPrice(balance.contractAddress, metadata.symbol)
            
            const tokenBalance: TokenBalance = {
              contractAddress: balance.contractAddress,
              name: metadata.name || 'Unknown Token',
              symbol: metadata.symbol || 'UNKNOWN',
              balance: balance.tokenBalance,
              balanceFormatted: this.formatTokenBalance(balance.tokenBalance, metadata.decimals),
              decimals: metadata.decimals,
              logo: metadata.logo,
              price: price,
              valueUSD: price ? parseFloat(this.formatTokenBalance(balance.tokenBalance, metadata.decimals)) * price : 0
            }
            
            tokenBalances.push(tokenBalance)
          } catch (error) {
            console.warn(`Failed to get metadata for token ${balance.contractAddress}:`, error)
          }
        }
        
        return tokenBalances.sort((a, b) => (b.valueUSD || 0) - (a.valueUSD || 0))
      } catch (error) {
        console.error('Error fetching token balances:', error)
        // Return mock data instead of empty array to prevent crashes
        return this.getMockTokenBalances()
      }
    })
  }

  // Get NFTs for an address
  async getNFTs(address: string): Promise<NFT[]> {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      return []
    }

    return this.getCachedOrFetch(`nfts-${address}-${this.currentChainId}`, async () => {
      try {
        // Check if we have a valid API key
        if (!process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || process.env.NEXT_PUBLIC_ALCHEMY_API_KEY === 'demo') {
          console.warn('No valid Alchemy API key provided, returning mock NFT data')
          return this.getMockNFTs()
        }

        const alchemy = this.getAlchemy()
        const nfts = await alchemy.nft.getNftsForOwner(address, {
          contractAddresses: [],
          omitMetadata: false,
          tokenUriTimeoutInMs: 5000,
          pageSize: 100
        })

        const nftList: NFT[] = []
        
        for (const nft of nfts.ownedNfts) {
          try {
            const nftData: NFT = {
              tokenId: nft.tokenId,
              name: nft.name || `#${nft.tokenId}`,
              description: nft.description,
              image: nft.image?.originalUrl || nft.image?.pngUrl,
              collectionName: nft.contract.name || 'Unknown Collection',
              contractAddress: nft.contract.address,
              floorPrice: await this.getNFTFloorPrice(nft.contract.address),
              traits: nft.raw?.metadata?.attributes || []
            }
            
            nftList.push(nftData)
          } catch (error) {
            console.warn(`Failed to process NFT ${nft.tokenId}:`, error)
          }
        }
        
        return nftList
      } catch (error) {
        console.error('Error fetching NFTs:', error)
        // Return mock data instead of empty array to prevent crashes
        return this.getMockNFTs()
      }
    })
  }

  // Get transaction history
  async getTransactions(address: string, limit: number = 50): Promise<Transaction[]> {
    return this.getCachedOrFetch(`transactions-${address}-${this.currentChainId}`, async () => {
      try {
        const rpcConfig = getRPCConfig(this.currentChainId)
        if (!rpcConfig) {
          throw new Error(`Unsupported chain: ${this.currentChainId}`)
        }

        // Get explorer API URL based on chain
        const explorerApiUrl = this.getExplorerApiUrl(this.currentChainId)
        const apiKey = this.getExplorerApiKey(this.currentChainId)
        
        const response = await axios.get(
          `${explorerApiUrl}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=${limit}&sort=desc&apikey=${apiKey}`
        )
        
        if (response.data.status !== '1') {
          throw new Error('Etherscan API error')
        }
        
        const transactions: Transaction[] = response.data.result.map((tx: any) => ({
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: tx.value,
          timestamp: parseInt(tx.timeStamp) * 1000,
          gasUsed: tx.gasUsed,
          gasPrice: tx.gasPrice,
          method: tx.methodId,
          status: tx.isError === '0' ? 'success' : 'failed',
          type: tx.from.toLowerCase() === address.toLowerCase() ? 'send' : 'receive'
        }))
        
        return transactions
      } catch (error) {
        console.error('Error fetching transactions:', error)
        return []
      }
    })
  }

  // Get DeFi positions (using DeFiPulse API or similar)
  async getDeFiPositions(address: string): Promise<DeFiPosition[]> {
    return this.getCachedOrFetch(`defi-${address}`, async () => {
      try {
        // This would integrate with DeFi protocols like Aave, Compound, Uniswap, etc.
        // For now, returning mock data
        const mockPositions: DeFiPosition[] = [
          {
            protocol: 'Uniswap V3',
            type: 'liquidity',
            asset: 'ETH/USDC',
            amount: '1.5',
            valueUSD: 4500,
            apy: 12.5
          },
          {
            protocol: 'Aave',
            type: 'lending',
            asset: 'USDC',
            amount: '10000',
            valueUSD: 10000,
            apy: 8.2
          }
        ]
        
        return mockPositions
      } catch (error) {
        console.error('Error fetching DeFi positions:', error)
        return []
      }
    })
  }

  // Get comprehensive portfolio summary
  async getPortfolioSummary(address: string): Promise<PortfolioSummary> {
    try {
      const [tokens, nfts, transactions, defiPositions] = await Promise.all([
        this.getTokenBalances(address),
        this.getNFTs(address),
        this.getTransactions(address, 10),
        this.getDeFiPositions(address)
      ])

      const totalValueUSD = tokens.reduce((sum, token) => sum + (token.valueUSD || 0), 0) +
                           defiPositions.reduce((sum, pos) => sum + pos.valueUSD, 0)

      const topTokens = tokens.slice(0, 5)
      
      const portfolioAllocation = tokens
        .filter(token => token.valueUSD && token.valueUSD > 0)
        .map(token => ({
          asset: token.symbol,
          value: token.valueUSD || 0,
          percentage: totalValueUSD > 0 ? ((token.valueUSD || 0) / totalValueUSD) * 100 : 0
        }))
        .sort((a, b) => b.value - a.value)

      return {
        totalValueUSD,
        tokenCount: tokens.length,
        nftCount: nfts.length,
        transactionCount: transactions.length,
        defiPositions: defiPositions.length,
        topTokens,
        recentTransactions: transactions.slice(0, 5),
        portfolioAllocation
      }
    } catch (error) {
      console.error('Error generating portfolio summary:', error)
      throw error
    }
  }

  // Helper methods
  private formatTokenBalance(balance: string, decimals: number): string {
    const balanceNum = parseInt(balance, 16)
    return (balanceNum / Math.pow(10, decimals)).toFixed(6)
  }

  // Get explorer API URL for specific chain
  private getExplorerApiUrl(chainId: number): string {
    switch (chainId) {
      case 1: // Ethereum Mainnet
        return 'https://api.etherscan.io/api'
      case 11155111: // Ethereum Sepolia
        return 'https://api-sepolia.etherscan.io/api'
      case 137: // Polygon Mainnet
        return 'https://api.polygonscan.com/api'
      case 80001: // Polygon Mumbai
        return 'https://api-testnet.polygonscan.com/api'
      case 42161: // Arbitrum Mainnet
        return 'https://api.arbiscan.io/api'
      case 421614: // Arbitrum Sepolia
        return 'https://api-sepolia.arbiscan.io/api'
      case 10: // Optimism Mainnet
        return 'https://api-optimistic.etherscan.io/api'
      case 11155420: // Optimism Sepolia
        return 'https://api-sepolia-optimistic.etherscan.io/api'
      case 8453: // Base Mainnet
        return 'https://api.basescan.org/api'
      case 84532: // Base Sepolia
        return 'https://api-sepolia.basescan.org/api'
      case 56: // BSC Mainnet
        return 'https://api.bscscan.com/api'
      case 97: // BSC Testnet
        return 'https://api-testnet.bscscan.com/api'
      case 43114: // Avalanche Mainnet
        return 'https://api.snowtrace.io/api'
      case 43113: // Avalanche Fuji
        return 'https://api.testnet.snowtrace.io/api'
      case 250: // Fantom Mainnet
        return 'https://api.ftmscan.com/api'
      case 4002: // Fantom Testnet
        return 'https://api.testnet.ftmscan.com/api'
      case 30: // Rootstock Mainnet
        return 'https://api.rsk.co/api'
      case 31: // Rootstock Testnet
        return 'https://api.testnet.rsk.co/api'
      default:
        return 'https://api.etherscan.io/api' // Default to Ethereum
    }
  }

  // Get explorer API key for specific chain
  private getExplorerApiKey(chainId: number): string {
    switch (chainId) {
      case 1: // Ethereum Mainnet
      case 11155111: // Ethereum Sepolia
        return process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY || 'demo'
      case 137: // Polygon Mainnet
      case 80001: // Polygon Mumbai
        return process.env.NEXT_PUBLIC_POLYGONSCAN_API_KEY || 'demo'
      case 42161: // Arbitrum Mainnet
      case 421614: // Arbitrum Sepolia
        return process.env.NEXT_PUBLIC_ARBISCAN_API_KEY || 'demo'
      case 10: // Optimism Mainnet
      case 11155420: // Optimism Sepolia
        return process.env.NEXT_PUBLIC_OPTIMISTIC_ETHERSCAN_API_KEY || 'demo'
      case 8453: // Base Mainnet
      case 84532: // Base Sepolia
        return process.env.NEXT_PUBLIC_BASESCAN_API_KEY || 'demo'
      case 56: // BSC Mainnet
      case 97: // BSC Testnet
        return process.env.NEXT_PUBLIC_BSCSCAN_API_KEY || 'demo'
      case 43114: // Avalanche Mainnet
      case 43113: // Avalanche Fuji
        return process.env.NEXT_PUBLIC_SNOWTRACE_API_KEY || 'demo'
      case 250: // Fantom Mainnet
      case 4002: // Fantom Testnet
        return process.env.NEXT_PUBLIC_FTMSCAN_API_KEY || 'demo'
      case 30: // Rootstock Mainnet
      case 31: // Rootstock Testnet
        return process.env.NEXT_PUBLIC_ROOTSTOCKSCAN_API_KEY || 'demo'
      default:
        return process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY || 'demo'
    }
  }

  private async getTokenPrice(contractAddress: string, symbol: string): Promise<number | undefined> {
    try {
      // Using CoinGecko API for price data
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${contractAddress}&vs_currencies=usd`
      )
      
      return response.data[contractAddress.toLowerCase()]?.usd
    } catch (error) {
      console.warn(`Failed to get price for ${symbol}:`, error)
      return undefined
    }
  }

  private async getNFTFloorPrice(contractAddress: string): Promise<number | undefined> {
    try {
      // This would integrate with OpenSea API or similar
      // For now, returning undefined
      return undefined
    } catch (error) {
      return undefined
    }
  }

  // Get portfolio analytics over time
  async getPortfolioHistory(address: string, days: number = 30): Promise<Array<{date: string, value: number}>> {
    // This would fetch historical portfolio data
    // For now, returning mock data
    const history = []
    const today = new Date()
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      history.push({
        date: date.toISOString().split('T')[0],
        value: Math.random() * 10000 + 5000 // Mock data
      })
    }
    
    return history
  }

  // Clear cache
  clearCache() {
    this.cache.clear()
  }

  // Mock data methods for fallback
  private getMockTokenBalances(): TokenBalance[] {
    return [
      {
        contractAddress: '0x0000000000000000000000000000000000000000',
        name: 'Ethereum',
        symbol: 'ETH',
        balance: '0x1bc16d674ec80000', // 2 ETH in hex
        balanceFormatted: '2.000000',
        decimals: 18,
        logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
        price: 2000,
        valueUSD: 4000
      },
      {
        contractAddress: '0xa0b86a33e6c0c6a7b8b8c8d8e8f8a9b9c9d9e9f',
        name: 'USD Coin',
        symbol: 'USDC',
        balance: '0x21e19e0c9bab2400000', // 10000 USDC in hex
        balanceFormatted: '10000.000000',
        decimals: 6,
        logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
        price: 1,
        valueUSD: 10000
      }
    ]
  }

  private getMockNFTs(): NFT[] {
    return [
      {
        tokenId: '1234',
        name: 'Bored Ape #1234',
        description: 'A unique Bored Ape Yacht Club NFT',
        image: 'https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=Bored+Ape',
        collectionName: 'Bored Ape Yacht Club',
        contractAddress: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
        floorPrice: 45.2,
        traits: [
          { trait_type: 'Background', value: 'Blue', rarity: 0.1 },
          { trait_type: 'Eyes', value: 'Laser Eyes', rarity: 0.05 },
          { trait_type: 'Mouth', value: 'Grin', rarity: 0.2 }
        ]
      },
      {
        tokenId: '5678',
        name: 'CryptoPunk #5678',
        description: 'A rare CryptoPunk NFT',
        image: 'https://via.placeholder.com/300x300/4ECDC4/FFFFFF?text=CryptoPunk',
        collectionName: 'CryptoPunks',
        contractAddress: '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb',
        floorPrice: 78.5,
        traits: [
          { trait_type: 'Type', value: 'Alien', rarity: 0.01 },
          { trait_type: 'Accessory', value: 'Cigarette', rarity: 0.15 }
        ]
      }
    ]
  }
}

// Singleton instance
export const analyticsService = new AnalyticsService()
