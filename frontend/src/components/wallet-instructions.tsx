'use client'

import { Wallet, Download, Link, CheckCircle } from 'lucide-react'

export function WalletInstructions() {
  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-kadena-500/20 rounded-full mb-4">
          <Wallet className="h-8 w-8 text-kadena-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
        <p className="text-gray-400">Follow these steps to start using AI DeFi</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-4 p-4 bg-gray-700/30 rounded-lg">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
            <Download className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <h4 className="font-medium text-white mb-1">Install MetaMask</h4>
            <p className="text-sm text-gray-400">
              If you don't have MetaMask installed, download it from{' '}
              <a 
                href="https://metamask.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-kadena-400 hover:text-kadena-300 underline"
              >
                metamask.io
              </a>
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 bg-gray-700/30 rounded-lg">
          <div className="flex-shrink-0 w-8 h-8 bg-kadena-500/20 rounded-full flex items-center justify-center">
            <Link className="h-4 w-4 text-kadena-400" />
          </div>
          <div>
            <h4 className="font-medium text-white mb-1">Add Kadena Network</h4>
            <p className="text-sm text-gray-400">
              Click the "Add Network" button above to add Kadena Chainweb EVM Testnet to your wallet
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 bg-gray-700/30 rounded-lg">
          <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
            <CheckCircle className="h-4 w-4 text-green-400" />
          </div>
          <div>
            <h4 className="font-medium text-white mb-1">Connect & Get Test KDA</h4>
            <p className="text-sm text-gray-400">
              Connect your wallet and get test KDA from the{' '}
              <a 
                href="https://tools.kadena.io/faucet/evm" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-kadena-400 hover:text-kadena-300 underline"
              >
                Kadena faucet
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
