'use client'

import { useState } from 'react'
import { useAccount, useBalance, useSendTransaction } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Send, Wallet, Coins, TrendingUp } from 'lucide-react'
import { parseEther, formatEther } from 'viem'

interface BlockchainActionsProps {
  agentAddress?: string
}

export function BlockchainActions({ agentAddress }: BlockchainActionsProps) {
  const { address } = useAccount()
  const { data: balance } = useBalance({ address })
  const [tipAmount, setTipAmount] = useState('0.001')
  const [sendAmount, setSendAmount] = useState('')
  const [sendTo, setSendTo] = useState('')
  
  const { sendTransaction, isPending } = useSendTransaction()

  const handleSendTip = () => {
    if (!agentAddress) return
    
    sendTransaction({
      to: agentAddress as `0x${string}`,
      value: parseEther(tipAmount),
    })
  }

  const handleSendTransaction = () => {
    if (!sendTo || !sendAmount) return
    
    sendTransaction({
      to: sendTo as `0x${string}`,
      value: parseEther(sendAmount),
    })
  }

  return (
    <div className="space-y-4 p-4 border-t bg-muted/30">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-4 w-4 text-primary" />
        <h4 className="font-medium text-sm">Blockchain Actions</h4>
      </div>

      {/* Wallet Balance */}
      {balance && (
        <Card className="border-primary/20">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Your Balance</span>
              </div>
              <Badge variant="outline">
                {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tip Agent */}
      {agentAddress && (
        <Card className="border-primary/20">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Send className="h-4 w-4" />
              Tip Agent
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y-3">
            <div className="flex gap-2">
              <Input
                value={tipAmount}
                onChange={(e) => setTipAmount(e.target.value)}
                placeholder="0.001"
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground self-center">ETH</span>
            </div>
            <Button 
              onClick={handleSendTip}
              disabled={isPending}
              size="sm"
              className="w-full"
            >
              {isPending ? 'Sending...' : 'Send Tip'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Send Transaction */}
      <Card className="border-primary/20">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Send Transaction
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 space-y-3">
          <Input
            value={sendTo}
            onChange={(e) => setSendTo(e.target.value)}
            placeholder="0x..."
            className="w-full"
          />
          <div className="flex gap-2">
            <Input
              value={sendAmount}
              onChange={(e) => setSendAmount(e.target.value)}
              placeholder="0.001"
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground self-center">ETH</span>
          </div>
          <Button 
            onClick={handleSendTransaction}
            disabled={isPending || !sendTo || !sendAmount}
            size="sm"
            className="w-full"
          >
            {isPending ? 'Sending...' : 'Send'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
