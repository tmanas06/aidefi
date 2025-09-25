import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { polygonAmoy } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'EthGlobal dApp',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id',
  chains: [polygonAmoy],
  ssr: false,
})
