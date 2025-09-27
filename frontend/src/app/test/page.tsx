'use client'

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Frontend Test Page</h1>
      <div className="space-y-4">
        <div className="p-6 bg-gray-800 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Basic Styling Test</h2>
          <p className="text-gray-300">This page tests if the basic styling is working.</p>
        </div>
        
        <div className="p-6 bg-gradient-to-r from-kadena-500/20 to-purple-500/20 rounded-lg border border-kadena-500/30">
          <h2 className="text-2xl font-semibold mb-4 text-kadena-400">Gradient Test</h2>
          <p className="text-gray-300">This tests if gradients and custom colors work.</p>
        </div>
        
        <button className="px-6 py-3 bg-kadena-500 hover:bg-kadena-600 text-white rounded-lg transition-colors">
          Button Test
        </button>
      </div>
    </div>
  )
}
