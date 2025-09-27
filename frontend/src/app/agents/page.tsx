export default function AgentsPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-white">AI Agents</h1>
            <div className="px-3 py-1 bg-kadena-500/20 text-kadena-400 border border-kadena-500/30 rounded-full text-sm">
              3 Agents
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
                <p className="text-2xl font-bold text-white">3</p>
                <p className="text-sm text-kadena-400">+1 this week</p>
              </div>
              <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Total Profit</h3>
                <p className="text-2xl font-bold text-green-400">+$6,647</p>
                <p className="text-sm text-green-400">+12.5% this month</p>
              </div>
              <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Total Trades</h3>
                <p className="text-2xl font-bold text-white">101</p>
                <p className="text-sm text-blue-400">+23 this week</p>
              </div>
              <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Active Agents</h3>
                <p className="text-2xl font-bold text-purple-400">2</p>
                <p className="text-sm text-purple-400">67% uptime</p>
                  </div>
            </div>

            {/* Agents List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {[
                {
                  id: '1',
                  name: 'AI-Bot-01',
                  status: 'active',
                  performance: 94.2,
                  trades: 47,
                  profit: '+$2,847',
                  strategy: 'DCA + Momentum'
                },
                {
                  id: '2',
                  name: 'AI-Bot-02',
                  status: 'paused',
                  performance: 87.5,
                  trades: 23,
                  profit: '+$1,520',
                  strategy: 'Arbitrage'
                },
                {
                  id: '3',
                  name: 'AI-Bot-03',
                  status: 'active',
                  performance: 91.8,
                  trades: 31,
                  profit: '+$2,280',
                  strategy: 'Grid Trading'
                }
              ].map((agent) => (
                <div key={agent.id} className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:shadow-lg hover:shadow-kadena-500/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                      <div>
                      <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
                      <p className="text-sm text-gray-400">{agent.strategy}</p>
                      </div>
                    <div className={`px-3 py-1 rounded-full text-sm ${
                      agent.status === 'active' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {agent.status}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-700/50 rounded-lg">
                      <div className="text-sm text-gray-400 mb-1">Performance</div>
                      <div className={`text-xl font-bold ${
                        agent.performance >= 90 ? 'text-green-400' : 
                        agent.performance >= 80 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {agent.performance}%
                      </div>
                    </div>
                    <div className="text-center p-3 bg-gray-700/50 rounded-lg">
                      <div className="text-sm text-gray-400 mb-1">Trades</div>
                      <div className="text-xl font-bold text-white">{agent.trades}</div>
                  </div>
                    <div className="text-center p-3 bg-gray-700/50 rounded-lg">
                      <div className="text-sm text-gray-400 mb-1">Profit</div>
                      <div className="text-xl font-bold text-green-400">{agent.profit}</div>
                      </div>
                    <div className="text-center p-3 bg-gray-700/50 rounded-lg">
                      <div className="text-sm text-gray-400 mb-1">Status</div>
                      <div className="text-xl font-bold text-white">{agent.status}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-kadena-500/20 text-kadena-400 border border-kadena-500/30 rounded-lg hover:bg-kadena-500/30 transition-colors">
                      Configure
                    </button>
                    <button className="flex-1 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-colors">
                      Details
                    </button>
                  </div>
                  </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}