'use client'

import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { Wallet, AlertCircle, CheckCircle } from 'lucide-react'

export function MetaMaskConnect() {
  const { address, isConnected, chainId } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const [error, setError] = useState<string | null>(null)
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false)

  useEffect(() => {
    // Check if MetaMask is installed
    if (typeof window !== 'undefined' && window.ethereum) {
      setIsMetaMaskInstalled(true)
    }
  }, [])

  const handleConnect = async () => {
    setError(null)
    
    if (!isMetaMaskInstalled) {
      setError('MetaMask is not installed. Please install MetaMask first.')
      return
    }

    try {
      // Find the injected connector (MetaMask)
      const metaMaskConnector = connectors.find(connector => 
        connector.id === 'injected' || connector.name === 'MetaMask'
      )
      
      if (metaMaskConnector) {
        await connect({ connector: metaMaskConnector })
      } else {
        setError('MetaMask connector not found')
      }
    } catch (err: any) {
      console.error('Connection error:', err)
      setError(err.message || 'Failed to connect wallet')
    }
  }

  const handleDisconnect = () => {
    disconnect()
  }

  const addKadenaNetwork = async () => {
    if (!window.ethereum) {
      setError('MetaMask not detected')
      return
    }

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
      console.error('Network addition error:', err)
      if (err.code === 4902) {
        setError('Kadena network is already added')
      } else if (err.code === 4001) {
        setError('User rejected network addition')
      } else {
        setError(`Failed to add network: ${err.message}`)
      }
    }
  }

  // Not connected state
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center gap-4">
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm max-w-md text-center">
            {error}
          </div>
        )}
        
        {!isMetaMaskInstalled ? (
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-yellow-400 mx-auto mb-3" />
            <p className="text-yellow-400 mb-4">MetaMask not detected</p>
            <a
              href="https://metamask.io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
            >
              Install MetaMask
            </a>
          </div>
        ) : (
          <button
            onClick={handleConnect}
            disabled={isPending}
            className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-kadena-500 to-kadena-600 hover:from-kadena-600 hover:to-kadena-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-kadena-500/25 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Wallet className="h-6 w-6" />
            <span>{isPending ? 'Connecting...' : 'Connect MetaMask'}</span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-kadena-400 to-kadena-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          </button>
        )}
      </div>
    )
  }

  // Connected state
  const isKadenaNetwork = chainId === 5920

  return (
    <div className="flex flex-col items-center gap-4">
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm max-w-md text-center">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
        <CheckCircle className="h-6 w-6 text-green-400" />
        <div className="text-left">
          <div className="text-green-400 font-semibold">Wallet Connected</div>
          <div className="text-gray-300 text-sm font-mono">
            {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connected'}
          </div>
        </div>
      </div>

      {!isKadenaNetwork && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 max-w-md text-center">
          <AlertCircle className="h-6 w-6 text-amber-400 mx-auto mb-2" />
          <p className="text-amber-400 font-semibold mb-2">Wrong Network</p>
          <p className="text-amber-200/80 text-sm mb-3">
            Please switch to Kadena Chainweb EVM Testnet
          </p>
          <button
            onClick={addKadenaNetwork}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 rounded-lg text-amber-300 hover:text-amber-200 transition-colors"
          >
            Add Kadena Network
          </button>
        </div>
      )}

      <button
        onClick={handleDisconnect}
        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors"
      >
        Disconnect Wallet
      </button>
    </div>
  )
}
