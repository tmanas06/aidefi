'use client'

import { Sidebar } from '@/components/sidebar'
import { WalletConnect } from '@/components/wallet-connect'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Shield, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react'

export default function IdentityPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Sidebar />
      
      <div className="lg:pl-64">
        <header className="bg-gray-900/50 border-b border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Identity Verification</h1>
              <p className="text-gray-400">Manage your zk-proof identity verification with Self Protocol</p>
            </div>
            <WalletConnect />
          </div>
        </header>

        <main className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Verification Status */}
            <div className="lg:col-span-2">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Shield className="mr-2 h-5 w-5" />
                    Verification Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Age Verification */}
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Age Verification</p>
                          <p className="text-gray-400 text-sm">Verified 18+ years old</p>
                        </div>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        Verified
                      </Badge>
                    </div>

                    {/* Country Verification */}
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Country Verification</p>
                          <p className="text-gray-400 text-sm">Verified United States</p>
                        </div>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        Verified
                      </Badge>
                    </div>

                    {/* Sanction Check */}
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Sanction Check</p>
                          <p className="text-gray-400 text-sm">No sanctions found</p>
                        </div>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        Clear
                      </Badge>
                    </div>

                    {/* KYC Verification */}
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-yellow-500/20 rounded-lg">
                          <Clock className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">KYC Verification</p>
                          <p className="text-gray-400 text-sm">Required for high-value transactions</p>
                        </div>
                      </div>
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        Pending
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Verification Level */}
              <Card className="bg-gray-900/50 border-gray-800 mt-6">
                <CardHeader>
                  <CardTitle className="text-white">Verification Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Current Level</span>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        Enhanced
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <p className="text-sm text-gray-400">
                      You have 3 out of 4 verifications completed. Complete KYC to reach Premium level.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Verification Actions */}
            <div className="space-y-6">
              {/* Quick Verify */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Quick Verify</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="neon" className="w-full">
                    <Shield className="mr-2 h-4 w-4" />
                    Verify Age
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Shield className="mr-2 h-4 w-4" />
                    Verify Country
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Shield className="mr-2 h-4 w-4" />
                    Complete KYC
                  </Button>
                </CardContent>
              </Card>

              {/* Verification Benefits */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Verification Benefits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                    <div>
                      <p className="text-white text-sm font-medium">Higher Transaction Limits</p>
                      <p className="text-gray-400 text-xs">Up to $10,000 per transaction</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                    <div>
                      <p className="text-white text-sm font-medium">Priority Support</p>
                      <p className="text-gray-400 text-xs">24/7 customer support</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                    <div>
                      <p className="text-white text-sm font-medium">Advanced Features</p>
                      <p className="text-gray-400 text-xs">Access to premium DeFi features</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Notice */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5 text-yellow-400" />
                    Security Notice
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400">
                    Your identity verification uses zero-knowledge proofs, ensuring your personal data remains private while proving compliance.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
