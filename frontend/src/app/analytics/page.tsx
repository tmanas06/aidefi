export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white">Analytics</h1>
            <div className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-sm">
              Live Data
            </div>
          </div>
          <button className="px-6 py-3 bg-kadena-500 hover:bg-kadena-600 text-white rounded-lg transition-colors">
            Export Data
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
              <a href="/analytics" className="block px-3 py-2 text-kadena-400 bg-kadena-500/20 rounded-lg">Analytics</a>
              <a href="/payments" className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg">Payments</a>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Total Volume</h3>
                <p className="text-2xl font-bold text-white">$1,234,567</p>
                <p className="text-sm text-green-400">+15% from last month</p>
              </div>
              <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Total Transactions</h3>
                <p className="text-2xl font-bold text-white">8,765</p>
                <p className="text-sm text-green-400">+8% from last month</p>
              </div>
              <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Active Users</h3>
                <p className="text-2xl font-bold text-white">1,234</p>
                <p className="text-sm text-green-400">+20% from last month</p>
              </div>
              <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Average Transaction</h3>
                <p className="text-2xl font-bold text-white">$140</p>
                <p className="text-sm text-red-400">-2% from last month</p>
              </div>
            </div>

            {/* Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">Volume Over Time</h3>
                <div className="h-64 bg-gray-700/50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-400">Chart will be implemented here</p>
                </div>
              </div>
              <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">Transaction Distribution</h3>
                <div className="h-64 bg-gray-700/50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-400">Chart will be implemented here</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}