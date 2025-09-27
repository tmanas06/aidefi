import { Alchemy, Network, NftTokenType } from 'alchemy-sdk'
import axios from 'axios'

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
    return this.getCachedOrFetch(`tokens-${address}`, async () => {
      try {
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
        return []
      }
    })
  }

  // Get NFTs for an address
  async getNFTs(address: string): Promise<NFT[]> {
    return this.getCachedOrFetch(`nfts-${address}`, async () => {
      try {
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
        return []
      }
    })
  }

  // Get transaction history
  async getTransactions(address: string, limit: number = 50): Promise<Transaction[]> {
    return this.getCachedOrFetch(`transactions-${address}`, async () => {
      try {
        const response = await axios.get(
          `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=${limit}&sort=desc&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY || 'demo'}`
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
}

// Singleton instance
export const analyticsService = new AnalyticsService()
