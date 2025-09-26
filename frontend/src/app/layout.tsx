import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { ClientOnly } from '@/components/client-only'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EthGlobal dApp - DeFi Automation Platform',
  description: 'Advanced DeFi platform with Polygon + x402 + ASI + Brewit.money integration for automated trading and smart wallet management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} dark`}>
        <ClientOnly fallback={
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-white text-lg">Loading DeFi Platform...</p>
            </div>
          </div>
        }>
          <Providers>
            {children}
          </Providers>
        </ClientOnly>
      </body>
    </html>
  )
}