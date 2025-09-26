import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { ClientOnly } from '@/components/client-only'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EthGlobal dApp - Polygon + x402 + ASI',
  description: 'Hackathon-ready dApp integrating Polygon, x402, ASI, and Self Protocol',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientOnly fallback={<div>Loading...</div>}>
          <Providers>
            {children}
          </Providers>
        </ClientOnly>
      </body>
    </html>
  )
}