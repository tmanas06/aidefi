'use client'

import { useAccount, useChainId, useConnections } from 'wagmi'

export function DebugInfo() {
  const { address, isConnected, chain } = useAccount()
  const chainId = useChainId()
  const connections = useConnections()

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg p-4 text-xs font-mono max-w-sm">
      <div className="text-green-400 font-bold mb-2">Debug Info</div>
      <div className="space-y-1 text-gray-300">
        <div>Connected: <span className={isConnected ? 'text-green-400' : 'text-red-400'}>{String(isConnected)}</span></div>
        <div>Address: <span className="text-blue-400">{address || 'None'}</span></div>
        <div>Chain ID: <span className="text-yellow-400">{chainId}</span></div>
        <div>Chain Name: <span className="text-purple-400">{chain?.name || 'Unknown'}</span></div>
        <div>Connections: <span className="text-orange-400">{connections.length}</span></div>
        <div>MetaMask: <span className={typeof window !== 'undefined' && window.ethereum ? 'text-green-400' : 'text-red-400'}>
          {typeof window !== 'undefined' && window.ethereum ? 'Detected' : 'Not Found'}
        </span></div>
      </div>
    </div>
  )
}
