'use client'

import { useState } from 'react'
import { Plus, AlertCircle } from 'lucide-react'

export function AddKadenaNetwork() {
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addKadenaNetwork = async () => {
    if (!window.ethereum) {
      setError('MetaMask not detected. Please install MetaMask first.')
      return
    }

    setIsAdding(true)
    setError(null)

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x1720', // 5920 in hex
            chainName: 'Kadena Chainweb EVM Testnet',
            nativeCurrency: {
              name: 'Kadena',
              symbol: 'KDA',
              decimals: 18,
            },
            rpcUrls: ['https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc'],
            blockExplorerUrls: ['https://chain-20.evm-testnet-blockscout.chainweb.com'],
          },
        ],
      })
    } catch (err: any) {
      if (err.code === 4902) {
        // Chain already added
        setError('Kadena network is already added to your wallet.')
      } else if (err.code === 4001) {
        setError('User rejected the network addition.')
      } else {
        setError(`Failed to add network: ${err.message}`)
      }
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-amber-300 mb-2">
            Add Kadena Chainweb EVM Testnet
          </h3>
          <p className="text-sm text-amber-200/80 mb-3">
            To use this dApp, you need to add the Kadena Chainweb EVM Testnet to your wallet.
          </p>
          {error && (
            <p className="text-sm text-red-400 mb-3">{error}</p>
          )}
          <button
            onClick={addKadenaNetwork}
            disabled={isAdding}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 rounded-lg text-amber-300 hover:text-amber-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
            {isAdding ? 'Adding...' : 'Add Network'}
          </button>
        </div>
      </div>
    </div>
  )
}
