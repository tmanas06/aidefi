# 🚀 AI DeFi Kadena Setup Guide

This guide will walk you through setting up the complete AI DeFi system on Kadena Chainweb EVM.

## 📋 Prerequisites

- Node.js 18+ and pnpm
- MetaMask wallet
- Git
- Basic understanding of DeFi and smart contracts

## 🛠️ Installation

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd aidefi
pnpm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp env.example .env

# Edit .env with your configuration
# You'll need to add your private key and other settings
```

## 🔧 MetaMask Configuration

### Option 1: Automatic Setup (Recommended)

1. Open your browser and go to the dApp
2. Open browser console (F12)
3. Run the setup script:
```javascript
// Load the setup script
const script = document.createElement('script');
script.src = '/scripts/setup-metamask.js';
document.head.appendChild(script);

// Run setup
completeSetup();
```

### Option 2: Manual Setup

1. Open MetaMask
2. Click on the network dropdown
3. Click "Add Network"
4. Enter the following details:

**Network Name:** Chainweb EVM Testnet
**RPC URL:** `https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc`
**Chain ID:** `5920`
**Currency Symbol:** `KDA`
**Block Explorer:** `http://chain-20.evm-testnet-blockscout.chainweb.com/`

## 💰 Get Test KDA

1. Visit the Kadena EVM Faucet: https://tools.kadena.io/faucet/evm
2. Connect your MetaMask wallet
3. Request test KDA (you can get up to 100 KDA per day)

## 🏗️ Deploy Smart Contracts

### 1. Compile Contracts

```bash
pnpm compile
```

### 2. Run Tests

```bash
pnpm test
```

### 3. Deploy to Testnet

```bash
pnpm deploy:testnet
```

This will deploy all contracts and output the addresses. Save these addresses!

### 4. Update Environment Variables

Add the deployed contract addresses to your `.env` file:

```env
AI_DELEGATE_ADDRESS=0x...
MOCK_TOKEN_ADDRESS=0x...
SIMPLE_SWAP_ADDRESS=0x...
CROSS_CHAIN_BRIDGE_ADDRESS=0x...
```

## 🧪 Test the System

### 1. Run System Test

```bash
pnpm test:system
```

This will test the complete workflow:
- Deploy contracts
- Create AI bot delegated account
- Test swap functionality
- Test bridge functionality
- Test spending limits

### 2. Manual Testing

1. Start the development servers:
```bash
pnpm dev
```

2. Open http://localhost:3000
3. Connect your MetaMask wallet
4. Create a delegated account for your AI bot
5. Test the swap and bridge functionality

## 🤖 AI Bot Setup

### 1. Create Delegated Account

1. Go to the "Delegated Accounts" page
2. Click "Create New Account"
3. Set spending limit (max 1 KDA recommended)
4. Configure allowed functions (swap, bridge)
5. Deploy the delegated account

### 2. Fund AI Bot

1. Transfer some KDA to the AI bot address
2. The AI bot can now execute transactions within its spending limit

### 3. Configure AI Automation

1. Go to the "AI Automation" page
2. Set up trading strategies
3. Configure market conditions
4. Enable automated trading

## 🔄 Workflow Examples

### Example 1: AI Bot Swap

```javascript
// AI bot executes a swap
const swapData = simpleSwap.interface.encodeFunctionData("swap");
await aiDelegate.connect(aiBot).executeViaDelegate(
  simpleSwapAddress,
  ethers.parseEther("0.5"), // 0.5 KDA
  swapData,
  { value: ethers.parseEther("0.5") }
);
```

### Example 2: AI Bot Bridge

```javascript
// AI bot initiates a bridge
const bridgeData = crossChainBridge.interface.encodeFunctionData(
  "initiateBridge",
  [tokenAddress, amount, targetChainId, recipient]
);
await aiDelegate.connect(aiBot).executeViaDelegate(
  crossChainBridgeAddress,
  0,
  bridgeData
);
```

## 🐛 Troubleshooting

### Common Issues

1. **MetaMask not connecting to Kadena**
   - Make sure you've added the correct network
   - Check that Chain ID is 5920
   - Try refreshing the page

2. **Transaction fails**
   - Check if you have enough KDA for gas
   - Verify the contract addresses are correct
   - Check if the AI bot has sufficient spending limit

3. **Contracts not deployed**
   - Make sure you have test KDA in your wallet
   - Check the network configuration
   - Verify your private key is correct

### Getting Help

1. Check the console for error messages
2. Verify all environment variables are set
3. Make sure contracts are deployed and verified
4. Check the Kadena testnet explorer for transaction status

## 📚 Additional Resources

- [Kadena Documentation](https://docs.kadena.io/)
- [Chainweb EVM Guide](https://docs.kadena.io/chainweb-evm)
- [MetaMask Documentation](https://docs.metamask.io/)
- [Hardhat Documentation](https://hardhat.org/docs)

## 🎯 Next Steps

1. **Deploy to Mainnet**: Once testing is complete, deploy to Kadena mainnet
2. **Add More Tokens**: Integrate with real Kadena tokens
3. **Advanced AI**: Implement more sophisticated AI trading strategies
4. **Mobile App**: Build a mobile version of the dApp
5. **Governance**: Add governance features for the community

## 🚨 Security Notes

- Never share your private key
- Always test on testnet first
- Use a hardware wallet for mainnet
- Regularly update your dependencies
- Audit your smart contracts before mainnet deployment

---

**Happy building! 🚀**

*This system demonstrates the power of AI automation in DeFi, with proper security controls and spending limits to protect your assets.*
