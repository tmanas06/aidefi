export default function AgentsPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white">AI Agents</h1>
            <div className="px-3 py-1 bg-kadena-500/20 text-kadena-400 border border-kadena-500/30 rounded-full text-sm">
              Loading...
            </div>
          </div>
          <button className="px-6 py-3 bg-kadena-500 hover:bg-kadena-600 text-white rounded-lg transition-colors">
            Create Agent
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
              <a href="/agents" className="block px-3 py-2 text-kadena-400 bg-kadena-500/20 rounded-lg">AI Agents</a>
              <a href="/analytics" className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg">Analytics</a>
              <a href="/payments" className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg">Payments</a>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Total Agents</h3>
                <p className="text-2xl font-bold text-white">Loading...</p>
                <p className="text-sm text-kadena-400">Fetching data...</p>
              </div>
              <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Total Profit</h3>
                <p className="text-2xl font-bold text-green-400">Loading...</p>
                <p className="text-sm text-green-400">Calculating...</p>
              </div>
              <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Total Trades</h3>
                <p className="text-2xl font-bold text-white">Loading...</p>
                <p className="text-sm text-blue-400">Fetching data...</p>
              </div>
              <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Active Agents</h3>
                <p className="text-2xl font-bold text-purple-400">Loading...</p>
                <p className="text-sm text-purple-400">Checking status...</p>
              </div>
            </div>

            {/* Agents List */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">AI Agents</h3>
              <div className="flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-700/50 rounded-full flex items-center justify-center">
                    <span className="text-2xl text-gray-400">🤖</span>
                  </div>
                  <h4 className="text-lg font-medium text-gray-300 mb-2">No agents created yet</h4>
                  <p className="text-gray-400 mb-4">Create your first AI trading agent to get started</p>
                  <button className="px-6 py-3 bg-kadena-500 hover:bg-kadena-600 text-white rounded-lg transition-colors">
                    Create Your First Agent
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}