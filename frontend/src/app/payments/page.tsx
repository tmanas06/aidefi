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
                <p className="text-2xl font-bold text-white">Loading...</p>
                <p className="text-sm text-kadena-300">Connecting to wallet...</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl">
                <h3 className="text-sm text-green-300 mb-2">Received Today</h3>
                <p className="text-2xl font-bold text-white">Loading...</p>
                <p className="text-sm text-green-300">Fetching data...</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl">
                <h3 className="text-sm text-blue-300 mb-2">Sent Today</h3>
                <p className="text-2xl font-bold text-white">Loading...</p>
                <p className="text-sm text-blue-300">Fetching data...</p>
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
                <div className="flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-700/50 rounded-full flex items-center justify-center">
                      <span className="text-2xl text-gray-400">📊</span>
                    </div>
                    <h4 className="text-lg font-medium text-gray-300 mb-2">No transactions yet</h4>
                    <p className="text-gray-400">Connect your wallet to view transaction history</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}