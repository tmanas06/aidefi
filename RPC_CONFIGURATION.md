# RPC Configuration Guide

This document explains how to configure RPC endpoints for multiple blockchain networks in your application.

## 🌐 Supported Networks

### Rootstock Networks
- **Rootstock Mainnet** (Chain ID: 30)
  - RPC: `https://public-node.rsk.co`
  - Explorer: `https://explorer.rsk.co`
  - Native Token: RBTC

- **Rootstock Testnet** (Chain ID: 31)
  - RPC: `https://rpc.testnet.rootstock.io`
  - Explorer: `https://explorer.testnet.rsk.co`
  - Native Token: tRBTC

### Ethereum Networks
- **Ethereum Mainnet** (Chain ID: 1)
- **Ethereum Sepolia** (Chain ID: 11155111)

### Layer 2 Networks
- **Polygon Mainnet** (Chain ID: 137)
- **Polygon Mumbai** (Chain ID: 80001)
- **Arbitrum One** (Chain ID: 42161)
- **Arbitrum Sepolia** (Chain ID: 421614)
- **Optimism** (Chain ID: 10)
- **Optimism Sepolia** (Chain ID: 11155420)
- **Base** (Chain ID: 8453)
- **Base Sepolia** (Chain ID: 84532)

### Other EVM Networks
- **BNB Smart Chain** (Chain ID: 56)
- **BNB Smart Chain Testnet** (Chain ID: 97)
- **Avalanche C-Chain** (Chain ID: 43114)
- **Avalanche Fuji** (Chain ID: 43113)
- **Fantom Opera** (Chain ID: 250)
- **Fantom Testnet** (Chain ID: 4002)

## 🔧 Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Wallet Connect Configuration
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id

# RPC URLs - Customize these for your preferred endpoints
# Rootstock Networks
NEXT_PUBLIC_ROOTSTOCK_MAINNET_RPC=https://public-node.rsk.co
NEXT_PUBLIC_ROOTSTOCK_TESTNET_RPC=https://rpc.testnet.rootstock.io

# Ethereum Networks
NEXT_PUBLIC_ETHEREUM_MAINNET_RPC=https://eth.llamarpc.com
NEXT_PUBLIC_ETHEREUM_SEPOLIA_RPC=https://rpc.sepolia.org

# Polygon Networks
NEXT_PUBLIC_POLYGON_MAINNET_RPC=https://polygon-rpc.com
NEXT_PUBLIC_POLYGON_MUMBAI_RPC=https://rpc-mumbai.maticvigil.com

# BSC Networks
NEXT_PUBLIC_BSC_MAINNET_RPC=https://bsc-dataseed.binance.org
NEXT_PUBLIC_BSC_TESTNET_RPC=https://data-seed-prebsc-1-s1.binance.org:8545

# Arbitrum Networks
NEXT_PUBLIC_ARBITRUM_MAINNET_RPC=https://arb1.arbitrum.io/rpc
NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC=https://sepolia-rollup.arbitrum.io/rpc

# Optimism Networks
NEXT_PUBLIC_OPTIMISM_MAINNET_RPC=https://mainnet.optimism.io
NEXT_PUBLIC_OPTIMISM_SEPOLIA_RPC=https://sepolia.optimism.io

# Avalanche Networks
NEXT_PUBLIC_AVALANCHE_MAINNET_RPC=https://api.avax.network/ext/bc/C/rpc
NEXT_PUBLIC_AVALANCHE_FUJI_RPC=https://api.avax-test.network/ext/bc/C/rpc

# Base Networks
NEXT_PUBLIC_BASE_MAINNET_RPC=https://mainnet.base.org
NEXT_PUBLIC_BASE_SEPOLIA_RPC=https://sepolia.base.org

# Fantom Networks
NEXT_PUBLIC_FANTOM_MAINNET_RPC=https://rpc.ftm.tools
NEXT_PUBLIC_FANTOM_TESTNET_RPC=https://rpc.testnet.fantom.network

# Blockchain Explorer API Keys
# Get these from respective block explorers for enhanced functionality
NEXT_PUBLIC_ETHERSCAN_API_KEY=your_etherscan_api_key
NEXT_PUBLIC_POLYGONSCAN_API_KEY=your_polygonscan_api_key
NEXT_PUBLIC_ARBISCAN_API_KEY=your_arbiscan_api_key
NEXT_PUBLIC_OPTIMISTIC_ETHERSCAN_API_KEY=your_optimistic_etherscan_api_key
NEXT_PUBLIC_BASESCAN_API_KEY=your_basescan_api_key
NEXT_PUBLIC_BSCSCAN_API_KEY=your_bscscan_api_key
NEXT_PUBLIC_SNOWTRACE_API_KEY=your_snowtrace_api_key
NEXT_PUBLIC_FTMSCAN_API_KEY=your_ftmscan_api_key
NEXT_PUBLIC_ROOTSTOCKSCAN_API_KEY=your_rootstockscan_api_key

# Alchemy API Key (for enhanced blockchain data)
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key

# WebSocket Configuration
NEXT_PUBLIC_WS_URL=http://localhost:3001

# Fetch.ai Configuration (Optional)
FETCHAI_NETWORK_URL=https://api.fetch.ai
FETCHAI_AGENTVERSE_URL=https://api.agentverse.ai
```

## 🚀 Usage

### 1. Basic Usage
The RPC configuration is automatically loaded when you use the wallet connection or analytics features.

### 2. Switching Networks
Users can switch between networks using the wallet interface. The application will automatically use the appropriate RPC endpoint.

### 3. Analytics Service
The analytics service automatically detects the current network and uses the appropriate RPC endpoint and explorer APIs.

```typescript
import { analyticsService } from '@/lib/analytics-service'

// Set the current chain (usually done automatically by wallet)
analyticsService.setCurrentChain(30) // Rootstock Mainnet

// Fetch portfolio data for the current chain
const portfolio = await analyticsService.getPortfolioSummary(address)
```

### 4. Custom RPC Configuration
You can access the RPC configuration programmatically:

```typescript
import { RPC_CONFIGS, getRPCConfig } from '@/lib/rpc-config'

// Get configuration for Rootstock Testnet
const rootstockConfig = getRPCConfig(31)

// Get all available configurations
const allConfigs = Object.values(RPC_CONFIGS)

// Get only testnet configurations
const testnetConfigs = Object.values(RPC_CONFIGS).filter(config => config.testnet)
```

## 🔑 API Keys

### Getting API Keys

1. **Etherscan**: https://etherscan.io/apis
2. **PolygonScan**: https://polygonscan.com/apis
3. **Arbiscan**: https://arbiscan.io/apis
4. **Optimistic Etherscan**: https://optimistic.etherscan.io/apis
5. **BaseScan**: https://basescan.org/apis
6. **BSCScan**: https://bscscan.com/apis
7. **Snowtrace**: https://snowtrace.io/apis
8. **FTMScan**: https://ftmscan.com/apis
9. **Alchemy**: https://www.alchemy.com/

### Rootstock Explorer API
Rootstock uses a different API structure. You may need to contact the Rootstock team for API access or use alternative data sources.

## 🛠 Customization

### Adding New Networks
To add support for new networks:

1. Add the network configuration to `src/lib/rpc-config.ts`
2. Update the wagmi configuration in `src/lib/wagmi.ts`
3. Add explorer API support in `src/lib/analytics-service.ts`
4. Update the environment variables documentation

### Custom RPC Endpoints
You can use custom RPC endpoints by updating the environment variables. This is useful for:
- Using premium RPC providers
- Setting up private networks
- Using local development networks

## 🔒 Security Notes

- Never commit API keys to version control
- Use environment variables for all sensitive configuration
- Consider using different API keys for development and production
- Regularly rotate your API keys
- Monitor API usage to avoid rate limits

## 📊 Features by Network

| Network | Token Balances | NFTs | Transactions | DeFi Data |
|---------|---------------|------|-------------|-----------|
| Ethereum | ✅ | ✅ | ✅ | ✅ |
| Polygon | ✅ | ✅ | ✅ | ✅ |
| Arbitrum | ✅ | ✅ | ✅ | ✅ |
| Optimism | ✅ | ✅ | ✅ | ✅ |
| Base | ✅ | ✅ | ✅ | ✅ |
| BSC | ✅ | ✅ | ✅ | ✅ |
| Avalanche | ✅ | ✅ | ✅ | ✅ |
| Fantom | ✅ | ✅ | ✅ | ✅ |
| Rootstock | ✅ | ✅ | ✅ | ⚠️ |

⚠️ Limited DeFi data available for Rootstock

## 🆘 Troubleshooting

### Common Issues

1. **RPC Connection Failed**
   - Check if the RPC URL is correct
   - Verify the network is accessible
   - Try alternative RPC endpoints

2. **API Rate Limits**
   - Get API keys from block explorers
   - Implement request caching
   - Use multiple API keys for load balancing

3. **Transaction History Not Loading**
   - Verify the explorer API key
   - Check if the address has transactions
   - Ensure the network is supported

4. **Token Balances Not Showing**
   - Verify Alchemy API key
   - Check if tokens are supported on the network
   - Ensure the address has token balances

For more help, check the individual service documentation or create an issue in the repository.
