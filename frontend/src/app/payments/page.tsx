'use client'

import { Sidebar } from '@/components/sidebar'
import { WalletConnect } from '@/components/wallet-connect'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Send, ArrowUpRight, ArrowDownLeft, History } from 'lucide-react'

export default function PaymentsPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Sidebar />
      
      <div className="lg:pl-64">
        <header className="bg-gray-900/50 border-b border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Payments</h1>
              <p className="text-gray-400">Send and receive payments with x402 validation</p>
            </div>
            <WalletConnect />
          </div>
        </header>

        <main className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Send Payment */}
            <div className="lg:col-span-2">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Send className="mr-2 h-5 w-5" />
                    Send Payment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="recipient" className="text-gray-300">Recipient Address</Label>
                      <Input
                        id="recipient"
                        placeholder="0x..."
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="amount" className="text-gray-300">Amount</Label>
                      <Input
                        id="amount"
                        placeholder="0.0"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="currency" className="text-gray-300">Currency</Label>
                      <select className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white">
                        <option value="MATIC">MATIC</option>
                        <option value="USDC">USDC</option>
                        <option value="USDT">USDT</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="memo" className="text-gray-300">Memo (Optional)</Label>
                      <Input
                        id="memo"
                        placeholder="Payment description"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                  <Button variant="neon" className="w-full">
                    <Send className="mr-2 h-4 w-4" />
                    Send Payment
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <ArrowUpRight className="mr-2 h-4 w-4" />
                    Send to Contact
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <ArrowDownLeft className="mr-2 h-4 w-4" />
                    Request Payment
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <History className="mr-2 h-4 w-4" />
                    View History
                  </Button>
                </CardContent>
              </Card>

              {/* Balance Card */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Wallet Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">MATIC</span>
                      <span className="text-white font-mono">1,234.56</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">USDC</span>
                      <span className="text-white font-mono">5,678.90</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">USDT</span>
                      <span className="text-white font-mono">2,345.67</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
