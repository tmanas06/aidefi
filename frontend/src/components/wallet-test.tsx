'use client'

import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi'
import { injected } from 'wagmi/connectors'

export function WalletTest() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending, error } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const [testResults, setTestResults] = useState<string[]>([])

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`])
  }

  const testWalletConnection = async () => {
    setTestResults([])
    addTestResult('Starting wallet connection test...')

    // Test 1: Check if window.ethereum exists
    if (typeof window !== 'undefined' && window.ethereum) {
      addTestResult('✅ window.ethereum detected')
    } else {
      addTestResult('❌ window.ethereum not found')
      return
    }

    // Test 2: Check available connectors
    const availableConnectors = connectors.map(c => c.name)
    addTestResult(`✅ Available connectors: ${availableConnectors.join(', ')}`)

    // Test 3: Try to connect
    try {
      const metaMaskConnector = connectors.find(connector => 
        connector.id === 'injected' || connector.name === 'MetaMask'
      )
      
      if (metaMaskConnector) {
        addTestResult('✅ MetaMask connector found')
        addTestResult('🔄 Attempting to connect...')
        
        await connect({ connector: metaMaskConnector })
        addTestResult('✅ Connection successful!')
      } else {
        addTestResult('❌ MetaMask connector not found')
      }
    } catch (err: any) {
      addTestResult(`❌ Connection failed: ${err.message}`)
    }
  }

  const testNetworkSwitch = async () => {
    if (!window.ethereum) {
      addTestResult('❌ window.ethereum not available for network switch test')
      return
    }

    try {
      addTestResult('🔄 Testing network switch to Kadena...')
      
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1720' }], // 5920 in hex
      })
      
      addTestResult('✅ Network switch successful!')
    } catch (err: any) {
      if (err.code === 4902) {
        addTestResult('⚠️ Network not added, attempting to add...')
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x1720',
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
          addTestResult('✅ Network added successfully!')
        } catch (addErr: any) {
          addTestResult(`❌ Failed to add network: ${addErr.message}`)
        }
      } else {
        addTestResult(`❌ Network switch failed: ${err.message}`)
      }
    }
  }

  useEffect(() => {
    if (isConnected) {
      addTestResult(`✅ Wallet connected: ${address}`)
      addTestResult(`✅ Chain ID: ${chainId}`)
      addTestResult(`✅ Network: ${chainId === 5920 ? 'Kadena Chainweb EVM Testnet' : 'Other'}`)
    }
  }, [isConnected, address, chainId])

  useEffect(() => {
    if (error) {
      addTestResult(`❌ Connection error: ${error.message}`)
    }
  }, [error])

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
      <h3 className="text-xl font-semibold text-white mb-4">Wallet Connection Test</h3>
      
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={testWalletConnection}
            disabled={isPending}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
          >
            {isPending ? 'Testing...' : 'Test Connection'}
          </button>
          
          <button
            onClick={testNetworkSwitch}
            disabled={!isConnected}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg transition-colors"
          >
            Test Network Switch
          </button>
        </div>
        
        {isConnected && (
          <button
            onClick={() => disconnect()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Disconnect Wallet
          </button>
        )}
      </div>

      <div className="bg-gray-900/50 rounded-lg p-4 max-h-64 overflow-y-auto">
        <h4 className="text-sm font-medium text-gray-400 mb-2">Test Results:</h4>
        <div className="space-y-1">
          {testResults.length === 0 ? (
            <p className="text-gray-500 text-sm">No tests run yet</p>
          ) : (
            testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono">
                <span className="text-gray-400">{result}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
