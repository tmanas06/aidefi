'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

interface DelegatedWallet {
  id: string
  address: string
  name: string
  type: 'bot_pol' | 'bot_eth' | 'bot_matic' | 'user_delegated'
  isActive: boolean
  permissions: string[]
  createdAt: string
  lastUsed: string
}

interface AutomatedOperation {
  id: string
  name: string
  task: string
  status: string
  scheduledAt: string
  lastExecuted?: string
  walletAddress: string
}

export default function BrewitPage() {
  const [wallets, setWallets] = useState<DelegatedWallet[]>([])
  const [operations, setOperations] = useState<AutomatedOperation[]>([])
  const [loading, setLoading] = useState(false)
  const [newWalletName, setNewWalletName] = useState('')
  const [selectedWalletType, setSelectedWalletType] = useState<'bot_pol' | 'bot_eth' | 'bot_matic' | 'user_delegated'>('user_delegated')
  const [operationName, setOperationName] = useState('')
  const [selectedTask, setSelectedTask] = useState<'send' | 'swap' | 'stake' | 'unstake' | 'claim'>('send')
  const [selectedWallet, setSelectedWallet] = useState('')
  const [transactionTo, setTransactionTo] = useState('')
  const [transactionValue, setTransactionValue] = useState('')
  const [transactionData, setTransactionData] = useState('')
  const [selectedWalletForTx, setSelectedWalletForTx] = useState('')

  useEffect(() => {
    fetchWallets()
    fetchOperations()
  }, [])

  const fetchWallets = async () => {
    try {
      const response = await fetch('/api/brewit/wallets/delegated')
      const data = await response.json()
      if (data.success) {
        setWallets(data.wallets)
      }
    } catch (error) {
      console.error('Error fetching wallets:', error)
    }
  }

  const fetchOperations = async () => {
    try {
      const response = await fetch('/api/brewit/operations')
      const data = await response.json()
      if (data.success) {
        setOperations(data.operations)
      }
    } catch (error) {
      console.error('Error fetching operations:', error)
    }
  }

  const createWallet = async () => {
    if (!newWalletName.trim()) return

    setLoading(true)
    try {
      const endpoint = selectedWalletType.startsWith('bot_') 
        ? '/api/brewit/wallets/bot'
        : '/api/brewit/wallets/user-delegated'

      // Generate validator and policy for SDK-based creation
      const validator = {
        address: '0xValidatorAddress', // This should be the actual validator contract
        initData: `0x${Date.now().toString(16)}`,
        salt: `0x${Math.random().toString(16).substring(2)}`
      }

      const policyParams = {
        policy: 'spendlimit' as const,
        tokenLimits: [{
          token: '0x0000000000000000000000000000000000000000', // ETH
          amount: '1000000000000000000' // 1 ETH
        }]
      }

      const payload = selectedWalletType.startsWith('bot_')
        ? {
            botType: selectedWalletType.split('_')[1],
            customName: newWalletName,
            tokenAddress: '0x0000000000000000000000000000000000000000',
            spendLimit: '1000000000000000000'
          }
        : {
            userAddress: '0x1234567890123456789012345678901234567890', // Replace with actual user address
            customName: newWalletName,
            spendLimit: '1000000000000000000'
          }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()
      if (data.success) {
        setWallets([data.wallet, ...wallets])
        setNewWalletName('')
      }
    } catch (error) {
      console.error('Error creating wallet:', error)
    } finally {
      setLoading(false)
    }
  }

  const createOperation = async () => {
    if (!operationName.trim() || !selectedWallet) return

    setLoading(true)
    try {
      const response = await fetch('/api/brewit/operations/ai-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: selectedWallet,
          operation: {
            name: operationName,
            repeat: 5000,
            times: 1,
            task: selectedTask,
            payload: {}
          }
        })
      })

      const data = await response.json()
      if (data.success) {
        setOperations([data.operation, ...operations])
        setOperationName('')
        setSelectedWallet('')
      }
    } catch (error) {
      console.error('Error creating operation:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleWalletStatus = async (walletId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/brewit/wallets/${walletId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive })
      })

      const data = await response.json()
      if (data.success) {
        setWallets(wallets.map(w => w.id === walletId ? { ...w, isActive } : w))
      }
    } catch (error) {
      console.error('Error updating wallet status:', error)
    }
  }

  const deleteOperation = async (operationId: string) => {
    try {
      const response = await fetch(`/api/brewit/operations/${operationId}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      if (data.success) {
        setOperations(operations.filter(op => op.id !== operationId))
      }
    } catch (error) {
      console.error('Error deleting operation:', error)
    }
  }

  const sendTransaction = async () => {
    if (!selectedWalletForTx || !transactionTo || !transactionValue) return

    setLoading(true)
    try {
      const response = await fetch(`/api/brewit/wallets/${selectedWalletForTx}/send-transaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: transactionTo,
          value: transactionValue,
          data: transactionData || undefined
        })
      })

      const data = await response.json()
      if (data.success) {
        alert(`Transaction sent! Hash: ${data.transactionHash}`)
        setTransactionTo('')
        setTransactionValue('')
        setTransactionData('')
        setSelectedWalletForTx('')
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error sending transaction:', error)
      alert('Failed to send transaction')
    } finally {
      setLoading(false)
    }
  }

  const getWalletTypeColor = (type: string) => {
    switch (type) {
      case 'bot_pol': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'bot_eth': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'bot_matic': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'user_delegated': return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'RUNNING': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'COMPLETED': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'FAILED': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'CANCELLED': return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
            <Zap className="h-4 w-4 text-blue-400" />
            <span className="text-blue-300 text-sm font-medium">Brewit.money Integration</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Smart Wallet
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Management</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Manage delegated wallets and automated AI agents with advanced DeFi automation
          </p>
        </div>

        {/* Create New Wallet */}
        <div className="glass-dark rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Create Delegated Wallet</h2>
              <p className="text-gray-400">Set up a new delegated wallet for AI agent operations</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="walletType" className="text-white font-medium mb-2 block">Wallet Type</Label>
              <select
                id="walletType"
                value={selectedWalletType}
                onChange={(e) => setSelectedWalletType(e.target.value as any)}
                className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              >
                <option value="user_delegated">User Delegated</option>
                <option value="bot_pol">Bot POL</option>
                <option value="bot_eth">Bot ETH</option>
                <option value="bot_matic">Bot MATIC</option>
              </select>
            </div>
            <div>
              <Label htmlFor="walletName" className="text-white font-medium mb-2 block">Wallet Name</Label>
              <Input
                id="walletName"
                value={newWalletName}
                onChange={(e) => setNewWalletName(e.target.value)}
                placeholder="Enter wallet name"
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={createWallet} 
                disabled={loading || !newWalletName.trim()}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 hover-lift disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Wallet'}
              </Button>
            </div>
          </div>
        </div>

        {/* Send Transaction */}
        <div className="glass-dark rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Send Transaction</h2>
              <p className="text-gray-400">Execute transactions using delegated accounts</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div>
              <Label htmlFor="walletForTx" className="text-white font-medium mb-2 block">Delegated Wallet</Label>
              <select
                id="walletForTx"
                value={selectedWalletForTx}
                onChange={(e) => setSelectedWalletForTx(e.target.value)}
                className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
              >
                <option value="">Select wallet</option>
                {wallets.filter(w => w.isActive).map(wallet => (
                  <option key={wallet.id} value={wallet.id}>
                    {wallet.name} ({wallet.type})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="transactionTo" className="text-white font-medium mb-2 block">To Address</Label>
              <Input
                id="transactionTo"
                value={transactionTo}
                onChange={(e) => setTransactionTo(e.target.value)}
                placeholder="0x..."
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
              />
            </div>
            <div>
              <Label htmlFor="transactionValue" className="text-white font-medium mb-2 block">Value (wei)</Label>
              <Input
                id="transactionValue"
                value={transactionValue}
                onChange={(e) => setTransactionValue(e.target.value)}
                placeholder="1000000000000000000"
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
              />
            </div>
            <div>
              <Label htmlFor="transactionData" className="text-white font-medium mb-2 block">Data (optional)</Label>
              <Input
                id="transactionData"
                value={transactionData}
                onChange={(e) => setTransactionData(e.target.value)}
                placeholder="0x..."
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={sendTransaction} 
                disabled={loading || !selectedWalletForTx || !transactionTo || !transactionValue}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 hover-lift disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Transaction'}
              </Button>
            </div>
          </div>
        </div>

        {/* Create New Operation */}
        <div className="glass-dark rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Create Automated Operation</h2>
              <p className="text-gray-400">Set up automated AI agent operations for delegated wallets</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <Label htmlFor="operationName" className="text-white font-medium mb-2 block">Operation Name</Label>
              <Input
                id="operationName"
                value={operationName}
                onChange={(e) => setOperationName(e.target.value)}
                placeholder="Enter operation name"
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
            <div>
              <Label htmlFor="taskType" className="text-white font-medium mb-2 block">Task Type</Label>
              <select
                id="taskType"
                value={selectedTask}
                onChange={(e) => setSelectedTask(e.target.value as any)}
                className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              >
                <option value="send">Send</option>
                <option value="swap">Swap</option>
                <option value="stake">Stake</option>
                <option value="unstake">Unstake</option>
                <option value="claim">Claim</option>
              </select>
            </div>
            <div>
              <Label htmlFor="walletSelect" className="text-white font-medium mb-2 block">Delegated Wallet</Label>
              <select
                id="walletSelect"
                value={selectedWallet}
                onChange={(e) => setSelectedWallet(e.target.value)}
                className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              >
                <option value="">Select wallet</option>
                {wallets.filter(w => w.isActive).map(wallet => (
                  <option key={wallet.id} value={wallet.address}>
                    {wallet.name} ({wallet.type})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={createOperation} 
                disabled={loading || !operationName.trim() || !selectedWallet}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 hover-lift disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Operation'}
              </Button>
            </div>
          </div>
        </div>

        {/* Delegated Wallets */}
        <div className="glass-dark rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Delegated Wallets</h2>
              <p className="text-gray-400">Manage your delegated wallets for AI agent operations</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {wallets.map((wallet) => (
              <div key={wallet.id} className="glass-dark rounded-xl p-6 hover-lift">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-white">{wallet.name}</h3>
                      <Badge className={`${getWalletTypeColor(wallet.type)} border-0`}>
                        {wallet.type.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Badge className={`${wallet.isActive ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'} border`}>
                        {wallet.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-300 font-mono mb-2">{wallet.address}</p>
                    <p className="text-xs text-gray-400">
                      Created: {new Date(wallet.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleWalletStatus(wallet.id, !wallet.isActive)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white"
                    >
                      {wallet.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {wallets.length === 0 && (
              <div className="text-center py-12">
                <Wallet className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No delegated wallets found</p>
                <p className="text-gray-500 text-sm">Create your first delegated wallet above</p>
              </div>
            )}
          </div>
        </div>

        {/* Automated Operations */}
        <div className="glass-dark rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Automated Operations</h2>
              <p className="text-gray-400">View and manage your automated AI agent operations</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {operations.map((operation) => (
              <div key={operation.id} className="glass-dark rounded-xl p-6 hover-lift">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-white">{operation.name}</h3>
                      <Badge className={`${getStatusColor(operation.status)} border-0`}>
                        {operation.status}
                      </Badge>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 border">
                        {operation.task.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-300 font-mono mb-2">{operation.walletAddress}</p>
                    <p className="text-xs text-gray-400">
                      Scheduled: {new Date(operation.scheduledAt).toLocaleString()}
                      {operation.lastExecuted && (
                        <span> • Last executed: {new Date(operation.lastExecuted).toLocaleString()}</span>
                      )}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteOperation(operation.id)}
                      className="bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30 hover:text-red-300"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {operations.length === 0 && (
              <div className="text-center py-12">
                <Bot className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No automated operations found</p>
                <p className="text-gray-500 text-sm">Create your first automated operation above</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
