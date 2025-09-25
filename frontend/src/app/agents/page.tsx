'use client'

import { Sidebar } from '@/components/sidebar'
import { WalletConnect } from '@/components/wallet-connect'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Bot, MessageCircle, Settings, Activity, CheckCircle, Clock } from 'lucide-react'

export default function AgentsPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Sidebar />
      
      <div className="lg:pl-64">
        <header className="bg-gray-900/50 border-b border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">AI Agents</h1>
              <p className="text-gray-400">Interact with your AI agents via ASI:One Chat Protocol</p>
            </div>
            <WalletConnect />
          </div>
        </header>

        <main className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <Card className="bg-gray-900/50 border-gray-800 h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Agent Chat
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  {/* Chat Messages */}
                  <div className="flex-1 space-y-4 mb-4 overflow-y-auto">
                    <div className="flex justify-start">
                      <div className="bg-gray-800 rounded-lg p-3 max-w-xs">
                        <p className="text-white text-sm">Hello! I'm your wallet agent. How can I help you today?</p>
                        <p className="text-gray-400 text-xs mt-1">2 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-cyan-500/20 border border-cyan-500/30 rounded-lg p-3 max-w-xs">
                        <p className="text-white text-sm">Send 10 USDC to 0xabcdef...</p>
                        <p className="text-gray-400 text-xs mt-1">1 minute ago</p>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-gray-800 rounded-lg p-3 max-w-xs">
                        <p className="text-white text-sm">I'll process that transaction for you. Please confirm the recipient address.</p>
                        <p className="text-gray-400 text-xs mt-1">1 minute ago</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Chat Input */}
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type your message..."
                      className="flex-1 bg-gray-800 border-gray-700 text-white"
                    />
                    <Button variant="neon">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Agent Status & Controls */}
            <div className="space-y-6">
              {/* Agent Status */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Agent Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Bot className="h-5 w-5 text-green-400" />
                      <div>
                        <p className="text-white font-medium">Wallet Agent</p>
                        <p className="text-gray-400 text-sm">Online</p>
                      </div>
                    </div>
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Bot className="h-5 w-5 text-green-400" />
                      <div>
                        <p className="text-white font-medium">Payment Agent</p>
                        <p className="text-gray-400 text-sm">Online</p>
                      </div>
                    </div>
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Bot className="h-5 w-5 text-yellow-400" />
                      <div>
                        <p className="text-white font-medium">Identity Agent</p>
                        <p className="text-gray-400 text-sm">Busy</p>
                      </div>
                    </div>
                    <Clock className="h-4 w-4 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>

              {/* Quick Commands */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Quick Commands</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Activity className="mr-2 h-4 w-4" />
                    Check Balance
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Send Payment
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    Verify Identity
                  </Button>
                </CardContent>
              </Card>

              {/* Agent Settings */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Agent Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Response Speed</label>
                    <select className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white">
                      <option value="fast">Fast</option>
                      <option value="normal">Normal</option>
                      <option value="detailed">Detailed</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Agent Personality</label>
                    <select className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white">
                      <option value="professional">Professional</option>
                      <option value="friendly">Friendly</option>
                      <option value="technical">Technical</option>
                    </select>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    Save Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
