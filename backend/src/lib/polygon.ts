import { createPublicClient, createWalletClient, http, parseEther, formatEther } from 'viem'
import { polygon } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'

// Polygon Mainnet configuration
export const polygonClient = createPublicClient({
  chain: polygon,
  transport: http(process.env.POLYGON_RPC_URL)
})

// Wallet client for transactions
export function createWalletClientFromPK(privateKey: string) {
  const account = privateKeyToAccount(privateKey as `0x${string}`)
  
  return createWalletClient({
    account,
    chain: polygon,
    transport: http(process.env.POLYGON_RPC_URL)
  })
}

// x402 Contract ABI (simplified for demo)
export const X402_ABI = [
  {
    "inputs": [
      { "name": "to", "type": "address" },
      { "name": "amount", "type": "uint256" },
      { "name": "data", "type": "bytes" }
    ],
    "name": "pay",
    "outputs": [{ "name": "success", "type": "bool" }],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "requestId", "type": "bytes32" }
    ],
    "name": "validateRequest",
    "outputs": [{ "name": "valid", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// USDC Contract ABI (simplified)
export const USDC_ABI = [
  {
    "inputs": [
      { "name": "to", "type": "address" },
      { "name": "amount", "type": "uint256" }
    ],
    "name": "transfer",
    "outputs": [{ "name": "success", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "account", "type": "address" }
    ],
    "name": "balanceOf",
    "outputs": [{ "name": "balance", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// Contract addresses (Amoy testnet)
export const CONTRACTS = {
  X402: process.env.X402_CONTRACT_ADDRESS || '0x1234567890123456789012345678901234567890',
  USDC: '0x41E94Eb019C0762f9BfF9fE4b9E9944c95f0f0C6', // Amoy USDC
  WMATIC: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889' // Amoy WMATIC
} as const

// Helper functions
export async function getBalance(address: string, tokenAddress?: string) {
  if (tokenAddress) {
    // ERC20 token balance
    const balance = await polygonClient.readContract({
      address: tokenAddress as `0x${string}`,
      abi: USDC_ABI,
      functionName: 'balanceOf',
      args: [address as `0x${string}`]
    })
    return formatEther(balance)
  } else {
    // Native MATIC balance
    const balance = await polygonClient.getBalance({ address: address as `0x${string}` })
    return formatEther(balance)
  }
}

export async function sendTransaction(
  privateKey: string,
  to: string,
  amount: string,
  tokenAddress?: string
) {
  const walletClient = createWalletClientFromPK(privateKey)
  
  if (tokenAddress) {
    // ERC20 token transfer
    const hash = await walletClient.writeContract({
      address: tokenAddress as `0x${string}`,
      abi: USDC_ABI,
      functionName: 'transfer',
      args: [to as `0x${string}`, parseEther(amount)]
    })
    return hash
  } else {
    // Native MATIC transfer
    const hash = await walletClient.sendTransaction({
      to: to as `0x${string}`,
      value: parseEther(amount)
    })
    return hash
  }
}
