export default function PaymentsPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white">Payments</h1>
            <div className="px-3 py-1 bg-kadena-500/20 text-kadena-400 border border-kadena-500/30 rounded-full text-sm">
              Kadena Network
            </div>
          </div>
          <button className="px-6 py-3 bg-kadena-500 hover:bg-kadena-600 text-white rounded-lg transition-colors">
            Send Payment
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800/50 border-r border-gray-700/50 min-h-screen">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Navigation</h2>
            <nav className="space-y-2">
              <a href="/" className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg">Dashboard</a>
              <a href="/agents" className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg">AI Agents</a>
              <a href="/analytics" className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg">Analytics</a>
              <a href="/payments" className="block px-3 py-2 text-kadena-400 bg-kadena-500/20 rounded-lg">Payments</a>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="space-y-8">
            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-gradient-to-br from-kadena-500/20 to-kadena-600/20 border border-kadena-500/30 rounded-xl">
                <h3 className="text-sm text-kadena-300 mb-2">Total Balance</h3>
                <p className="text-2xl font-bold text-white">12.5 KDA</p>
                <p className="text-sm text-kadena-300">≈ $23,750</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl">
                <h3 className="text-sm text-green-300 mb-2">Received Today</h3>
                <p className="text-2xl font-bold text-white">3.2 KDA</p>
                <p className="text-sm text-green-300">≈ $6,080</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl">
                <h3 className="text-sm text-blue-300 mb-2">Sent Today</h3>
                <p className="text-2xl font-bold text-white">1.8 KDA</p>
                <p className="text-sm text-blue-300">≈ $3,420</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-gradient-to-r from-kadena-500 to-kadena-600 hover:from-kadena-600 hover:to-kadena-700 text-white rounded-lg transition-all duration-300">
                Send Payment
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all duration-300">
                Receive Payment
              </button>
              <button className="px-6 py-3 border border-gray-600 text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors">
                Transaction History
              </button>
            </div>

            {/* Recent Transactions */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
              <div className="space-y-4">
                {[
                  { type: 'send', amount: '1.5 KDA', value: '$2,847', to: '0x1234...5678', status: 'completed', time: '2 min ago' },
                  { type: 'receive', amount: '0.8 KDA', value: '$1,520', from: '0x9876...5432', status: 'completed', time: '5 min ago' },
                  { type: 'send', amount: '2.0 KDA', value: '$3,800', to: '0x4567...8901', status: 'pending', time: '12 min ago' },
                  { type: 'receive', amount: '0.3 KDA', value: '$570', from: '0x2345...6789', status: 'completed', time: '18 min ago' },
                  { type: 'send', amount: '1.2 KDA', value: '$2,280', to: '0x3456...7890', status: 'failed', time: '25 min ago' }
                ].map((tx, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === 'send' ? 'bg-red-500/20' : 'bg-green-500/20'
                      }`}>
                        <span className="text-lg">{tx.type === 'send' ? '↑' : '↓'}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{tx.amount}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            tx.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {tx.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-400">
                          {tx.type === 'send' ? `To: ${tx.to}` : `From: ${tx.from}`} • {tx.time}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-white">{tx.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}