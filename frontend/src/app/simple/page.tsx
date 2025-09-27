export default function SimplePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-8">AI DeFi - Simple Test</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Card 1</h2>
            <p className="text-gray-300">This is a simple card test.</p>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Card 2</h2>
            <p className="text-gray-300">This is another simple card test.</p>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Card 3</h2>
            <p className="text-gray-300">This is the third simple card test.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
