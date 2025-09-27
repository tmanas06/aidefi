# Merchant Integration Guide

This document explains how the frontend integrates with the Python merchant and buyer services.

## 🏪 Overview

The frontend now includes a complete e-commerce marketplace that integrates with your Python merchant service running on port 8001. Users can browse products, make purchases using cryptocurrency, and track their purchase history.

## 🚀 Features

### **E-Commerce Dashboard**
- **Product Catalog**: Browse all available products from the merchant API
- **Real-time Search**: Search products by name, category, or description
- **Category Filtering**: Filter products by category (Electronics, Clothing, Art, etc.)
- **Grid/List Views**: Toggle between different viewing modes

### **Payment Processing**
- **Web3 Integration**: Seamless wallet connection and transaction handling
- **Token Transfers**: Automatic rUSDT token transfers for purchases
- **Payment Verification**: Real-time payment verification with the merchant service
- **Transaction Tracking**: Complete transaction history with blockchain links

### **Purchase Management**
- **Purchase History**: Track all completed purchases
- **Transaction Status**: Real-time status updates (pending, success, failed)
- **Blockchain Links**: Direct links to transaction details on block explorers
- **Local Storage**: Persistent purchase history across sessions

## 🛠 Setup Instructions

### **1. Start the Python Merchant Service**
```bash
cd python
python merchant.py
```
The merchant service will run on `http://127.0.0.1:8001`

### **2. Configure Environment Variables**
Create a `.env.local` file in your project root:
```env
# Merchant Service Configuration
NEXT_PUBLIC_MERCHANT_URL=http://127.0.0.1:8001

# Blockchain Configuration (for Rootstock)
RPC_URL=https://rpc.testnet.rootstock.io
MERCHANT_ADDRESS=your_merchant_wallet_address
RUSDT_CONTRACT=your_rusdt_contract_address
BUYER_PRIVATE_KEY=your_buyer_private_key
```

### **3. Start the Frontend**
```bash
npm run dev
```

## 🔧 API Integration

### **Merchant Service Endpoints**

#### **GET /goods**
- **Purpose**: Fetch all available products
- **Response**: List of products with pricing and metadata
- **Frontend Usage**: Product catalog display

#### **POST /purchase**
- **Purpose**: Initiate a purchase for a specific item
- **Payload**: `{ "item_id": "product_id" }`
- **Response**: Payment details including token address, amount, and recipient
- **Frontend Usage**: Payment initiation

#### **POST /retry_purchase**
- **Purpose**: Verify payment completion
- **Payload**: `{ "tx_hash": "transaction_hash", "amount": payment_amount }`
- **Response**: Payment verification status
- **Frontend Usage**: Purchase confirmation

### **Frontend Service Layer**

The `MerchantService` class handles all communication with the Python merchant API:

```typescript
import { merchantService } from '@/lib/merchant-service'

// Get all products
const products = await merchantService.getProducts()

// Initiate purchase
const paymentInfo = await merchantService.initiatePurchase(itemId)

// Verify payment
const verification = await merchantService.verifyPayment(txHash, amount)
```

## 💳 Payment Flow

### **1. Product Selection**
- User browses products in the marketplace
- Clicks "Purchase" on desired item
- Wallet connection is verified

### **2. Payment Initiation**
- Frontend calls merchant API `/purchase` endpoint
- Receives payment details (token address, amount, recipient)
- Displays payment information to user

### **3. Transaction Execution**
- User approves token transfer in wallet
- Frontend executes ERC-20 transfer contract call
- Transaction is broadcast to blockchain

### **4. Payment Verification**
- Frontend calls merchant API `/retry_purchase` endpoint
- Merchant verifies transaction on blockchain
- Purchase is confirmed or rejected

### **5. History Tracking**
- Successful purchases are added to local history
- Transaction links are provided for blockchain verification
- Purchase status is tracked locally

## 🎯 Supported Products

The marketplace currently supports these product types:

### **Token-Priced Products**
- **Crypto Hoodie**: 5 rUSDT
- **NFT Poster**: 3 rUSDT

### **USD-Priced Products** (Mock Data)
- AI Sticker Pack: $1.25
- Fetch.ai Merch Pack: $10.00
- Game Console: $10.00
- Smartphone: $50.00
- Laptop: $100.00
- Tablet: $80.00
- Smartwatch: $30.00
- Smart Home Device: $97.00

## 🔗 Blockchain Integration

### **Supported Networks**
- **Rootstock Testnet** (Primary)
- **Rootstock Mainnet** (Production)

### **Token Support**
- **rUSDT**: ERC-20 token on Rootstock network
- **Custom Tokens**: Extensible for other ERC-20 tokens

### **Transaction Features**
- **Gas Estimation**: Automatic gas calculation
- **Nonce Management**: Proper nonce handling
- **Error Handling**: Comprehensive error management
- **Status Tracking**: Real-time transaction status

## 📱 User Interface

### **Marketplace Tab**
- Access via sidebar "Marketplace" tab
- Product grid with search and filtering
- Purchase buttons with wallet integration
- Real-time merchant status indicator

### **Purchase History**
- Complete transaction history
- Status indicators (success, failed, pending)
- Blockchain explorer links
- Local storage persistence

### **Responsive Design**
- Mobile-friendly interface
- Grid and list view options
- Dark/light theme support
- Accessibility features

## 🚨 Error Handling

### **Merchant Service Offline**
- Graceful fallback to cached products
- Offline status indicator
- Retry mechanisms for failed requests

### **Wallet Connection Issues**
- Clear error messages
- Connection prompts
- Fallback options

### **Transaction Failures**
- Detailed error reporting
- Retry options
- Status tracking

## 🔒 Security Features

### **Payment Verification**
- Blockchain transaction verification
- Double-spending prevention
- Amount validation

### **Wallet Security**
- No private key exposure
- Secure transaction signing
- User-controlled approvals

### **Data Privacy**
- Local storage only
- No sensitive data transmission
- User-controlled data retention

## 🧪 Testing

### **Test Purchase Flow**
1. Connect wallet to Rootstock testnet
2. Ensure wallet has test rUSDT tokens
3. Select a token-priced product
4. Complete purchase flow
5. Verify transaction on blockchain explorer

### **Mock Data Testing**
- Products with USD pricing use mock data
- No actual payments processed for USD items
- Full UI testing without blockchain interaction

## 🔄 Development Workflow

### **Frontend Development**
```bash
# Start development server
npm run dev

# View marketplace at http://localhost:3000
# Click "Marketplace" tab in sidebar
```

### **Backend Development**
```bash
# Start merchant service
cd python
python merchant.py

# Test API endpoints
curl http://127.0.0.1:8001/goods
```

### **Integration Testing**
1. Start both services
2. Test complete purchase flow
3. Verify blockchain transactions
4. Check purchase history

## 📊 Monitoring

### **Merchant Service Health**
- Real-time status checking
- Automatic retry mechanisms
- Health indicators in UI

### **Transaction Monitoring**
- Transaction status tracking
- Error rate monitoring
- Performance metrics

## 🚀 Future Enhancements

### **Planned Features**
- Multi-token payment support
- Advanced product filtering
- Wishlist functionality
- Order tracking system
- Inventory management
- Seller dashboard

### **Integration Opportunities**
- DeFi protocol integration
- NFT marketplace features
- Cross-chain payments
- Automated refund system

## 🆘 Troubleshooting

### **Common Issues**

1. **Merchant Service Not Responding**
   - Check if Python service is running on port 8001
   - Verify network connectivity
   - Check firewall settings

2. **Wallet Connection Failed**
   - Ensure wallet is connected to Rootstock testnet
   - Check wallet permissions
   - Verify network configuration

3. **Transaction Failed**
   - Check wallet balance (need rUSDT for gas and payment)
   - Verify contract address
   - Check gas price settings

4. **Payment Verification Failed**
   - Wait for transaction confirmation
   - Check transaction hash validity
   - Verify merchant service is running

For more help, check the individual component documentation or create an issue in the repository.
