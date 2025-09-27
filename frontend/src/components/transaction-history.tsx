'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { kadenaExplorer, Transaction, TokenTransfer } from '@/lib/kadena-explorer'
import { 
  ExternalLink, 
  Copy, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ArrowUpRight, 
  ArrowDownLeft,
  RefreshCw,
  Filter
} from 'lucide-react'

interface TransactionHistoryProps {
  address: string
  className?: string
}

export function TransactionHistory({ address, className }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [tokenTransfers, setTokenTransfers] = useState<TokenTransfer[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'transactions' | 'tokens'>('all')
  const [copiedHash, setCopiedHash] = useState<string | null>(null)

  const fetchData = async () => {
    if (!address) return
    
    setLoading(true)
    try {
      const [txData, tokenData] = await Promise.all([
        kadenaExplorer.getTransactions(address),
        kadenaExplorer.getTokenTransfers(address)
      ])
      setTransactions(txData)
      setTokenTransfers(tokenData)
    } catch (error) {
      console.error('Error fetching transaction data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [address])

  const copyToClipboard = async (text: string, hash: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedHash(hash)
      setTimeout(() => setCopiedHash(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatValue = (value: string) => {
    const num = parseFloat(value)
    if (num === 0) return '0'
    if (num < 0.000001) return '< 0.000001'
    return num.toFixed(6)
  }

  const getTransactionIcon = (tx: Transaction) => {
    if (tx.functionName?.includes('swap') || tx.functionName?.includes('Swap')) {
      return <ArrowUpRight className="h-4 w-4 text-blue-400" />
    }
    if (tx.functionName?.includes('bridge') || tx.functionName?.includes('Bridge')) {
      return <ArrowDownLeft className="h-4 w-4 text-purple-400" />
    }
    return tx.from.toLowerCase() === address.toLowerCase() ? 
      <ArrowUpRight className="h-4 w-4 text-red-400" /> : 
      <ArrowDownLeft className="h-4 w-4 text-green-400" />
  }

  const getTokenTransferIcon = (transfer: TokenTransfer) => {
    return transfer.from.toLowerCase() === address.toLowerCase() ? 
      <ArrowUpRight className="h-4 w-4 text-red-400" /> : 
      <ArrowDownLeft className="h-4 w-4 text-green-400" />
  }

  const filteredTransactions = activeTab === 'all' ? 
    [...transactions, ...tokenTransfers].sort((a, b) => parseInt(b.timeStamp) - parseInt(a.timeStamp)) :
    activeTab === 'transactions' ? transactions :
    tokenTransfers

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-white">Transaction History</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              onClick={fetchData}
              disabled={loading}
              size="sm"
              variant="outline"
              className="text-white border-gray-600 hover:bg-gray-700"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'all' 
                    ? 'bg-kadena-500 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'transactions' 
                    ? 'bg-kadena-500 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Transactions
              </button>
              <button
                onClick={() => setActiveTab('tokens')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'tokens' 
                    ? 'bg-kadena-500 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Tokens
              </button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-kadena-500" />
            <span className="ml-2 text-gray-400">Loading transactions...</span>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No transactions found</p>
            <p className="text-sm text-gray-500 mt-2">
              Connect your wallet to view transaction history
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTransactions.map((item, index) => {
              const isTransaction = 'methodId' in item
              const tx = isTransaction ? item as Transaction : null
              const transfer = isTransaction ? null : item as TokenTransfer

              return (
                <div
                  key={`${isTransaction ? 'tx' : 'transfer'}-${index}`}
                  className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isTransaction ? getTransactionIcon(tx!) : getTokenTransferIcon(transfer!)}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">
                            {isTransaction ? (tx!.functionName || 'Transfer') : `${transfer!.tokenSymbol} Transfer`}
                          </span>
                          {isTransaction && (
                            <Badge 
                              variant={tx!.isError === '0' ? 'default' : 'destructive'}
                              className="text-xs"
                            >
                              {tx!.isError === '0' ? (
                                <><CheckCircle className="h-3 w-3 mr-1" /> Success</>
                              ) : (
                                <><XCircle className="h-3 w-3 mr-1" /> Failed</>
                              )}
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-400">
                          {isTransaction ? (
                            <>
                              From: {formatAddress(tx!.from)} → To: {formatAddress(tx!.to)}
                            </>
                          ) : (
                            <>
                              {transfer!.tokenName} ({transfer!.tokenSymbol})
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-white font-medium">
                        {isTransaction ? 
                          `${formatValue(kadenaExplorer.formatTransaction(tx!).value)} KDA` :
                          `${formatValue(kadenaExplorer.formatTokenTransfer(transfer!).value)} ${transfer!.tokenSymbol}`
                        }
                      </div>
                      <div className="text-sm text-gray-400">
                        {new Date(parseInt(item.timeStamp) * 1000).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        Hash: {formatAddress(item.hash)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(item.hash, item.hash)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {copiedHash === item.hash ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs border-gray-600 hover:bg-gray-700"
                        onClick={() => window.open(
                          isTransaction ? 
                            kadenaExplorer.getTransactionUrl(tx!.hash) :
                            kadenaExplorer.getTransactionUrl(transfer!.hash),
                          '_blank'
                        )}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View on Explorer
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
