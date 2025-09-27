'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AgentList } from './agent-list'
import { FetchAIAgentList } from './fetchai-agent-list'
import { AgentCard } from './agent-card'
import { FetchAIAgentCard } from './fetchai-agent-card'
import { fetchAIService, FetchAIAgent } from '@/lib/fetchai-service'
import { useFetchAI } from '@/hooks/useFetchAI'
import { agentStatusService } from '@/lib/agent-status-service'
import { 
  Bot, 
  MessageCircle, 
  Search, 
  Filter, 
  RefreshCw, 
  Users, 
  Zap, 
  Shield, 
  Globe,
  Settings,
  Activity,
  Star,
  TrendingUp
} from 'lucide-react'

// Extended agent interface for local agents
interface LocalAgent {
  id: string
  name: string
  description: string
  role: 'blockchain' | 'ai_assistant' | 'data_analyst' | 'customer_support' | 'trading' | 'defi'
  status: 'online' | 'offline' | 'busy'
  capabilities: string[]
  avatar?: string
  price?: number
  endpoint?: string
  port?: number
}

export function AgentsDashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedAgent, setSelectedAgent] = useState<LocalAgent | FetchAIAgent | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [agentStatuses, setAgentStatuses] = useState<Map<string, string>>(new Map())
  const { agents: fetchAIAgents, loading, error, connectToAgent } = useFetchAI()

  // Initialize agent status service
  useEffect(() => {
    const allAgents = [
      ...localAgents.map(agent => ({ id: agent.id, name: agent.name, endpoint: agent.endpoint, port: agent.port })),
      ...fetchAIAgents.map(agent => ({ id: agent.id, name: agent.name, endpoint: agent.endpoint, port: agent.port }))
    ]
    
    agentStatusService.initialize(allAgents)
    
    // Update statuses periodically
    const statusInterval = setInterval(() => {
      const statuses = agentStatusService.getAllAgentStatuses()
      const statusMap = new Map(statuses.map(status => [status.id, status.status]))
      setAgentStatuses(statusMap)
    }, 5000)

    return () => {
      clearInterval(statusInterval)
      agentStatusService.destroy()
    }
  }, [fetchAIAgents])

  // Local agents configuration
  const [localAgents] = useState<LocalAgent[]>([
    {
      id: 'merchant-agent',
      name: 'Merchant Agent',
      description: 'Handles e-commerce operations, product listings, and payment processing for the marketplace',
      role: 'blockchain',
      status: 'online',
      capabilities: ['e-commerce', 'payment-processing', 'product-management', 'inventory-tracking'],
      endpoint: '127.0.0.1',
      port: 8003,
      price: 0
    },
    {
      id: 'buyer-agent',
      name: 'Buyer Agent',
      description: 'Assists users with purchasing decisions, transaction management, and wallet operations',
      role: 'blockchain',
      status: 'online',
      capabilities: ['purchase-assistance', 'transaction-management', 'wallet-operations', 'price-comparison'],
      endpoint: '127.0.0.1',
      port: 8004,
      price: 0
    },
    {
      id: 'analytics-agent',
      name: 'Analytics Agent',
      description: 'Provides comprehensive portfolio analysis, market insights, and trading recommendations',
      role: 'data_analyst',
      status: 'online',
      capabilities: ['portfolio-analysis', 'market-research', 'trading-signals', 'risk-assessment'],
      endpoint: '127.0.0.1',
      port: 8005,
      price: 0
    },
    {
      id: 'defi-agent',
      name: 'DeFi Agent',
      description: 'Specializes in DeFi protocols, yield farming, liquidity provision, and staking strategies',
      role: 'defi',
      status: 'online',
      capabilities: ['yield-farming', 'liquidity-provision', 'staking', 'protocol-analysis'],
      endpoint: '127.0.0.1',
      port: 8006,
      price: 0
    },
    {
      id: 'nft-agent',
      name: 'NFT Agent',
      description: 'Expert in NFT collections, marketplace analysis, and digital asset valuation',
      role: 'ai_assistant',
      status: 'online',
      capabilities: ['nft-analysis', 'collection-tracking', 'marketplace-insights', 'valuation'],
      endpoint: '127.0.0.1',
      port: 8007,
      price: 0
    },
    {
      id: 'trading-agent',
      name: 'Trading Agent',
      description: 'Advanced trading bot with automated strategies, risk management, and market execution',
      role: 'trading',
      status: 'busy',
      capabilities: ['automated-trading', 'strategy-execution', 'risk-management', 'market-analysis'],
      endpoint: '127.0.0.1',
      port: 8008,
      price: 5
    }
  ])

  const categories = [
    { id: 'all', label: 'All Agents', icon: Users, count: localAgents.length + fetchAIAgents.length },
    { id: 'blockchain', label: 'Blockchain', icon: Shield, count: localAgents.filter(a => a.role === 'blockchain').length },
    { id: 'ai_assistant', label: 'AI Assistant', icon: Bot, count: localAgents.filter(a => a.role === 'ai_assistant').length },
    { id: 'data_analyst', label: 'Data Analyst', icon: TrendingUp, count: localAgents.filter(a => a.role === 'data_analyst').length },
    { id: 'defi', label: 'DeFi', icon: Zap, count: localAgents.filter(a => a.role === 'defi').length },
    { id: 'trading', label: 'Trading', icon: Activity, count: localAgents.filter(a => a.role === 'trading').length },
    { id: 'fetchai', label: 'Fetch.ai Network', icon: Globe, count: fetchAIAgents.length }
  ]

  const filteredAgents = (selectedCategory === 'all' ? localAgents : localAgents.filter(a => a.role === selectedCategory))
    .filter(agent => 
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.capabilities.some(cap => cap.toLowerCase().includes(searchTerm.toLowerCase()))
    )

  const filteredFetchAIAgents = selectedCategory === 'fetchai' || selectedCategory === 'all' 
    ? fetchAIAgents.filter(agent => 
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.capabilities.some(cap => cap.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : []

  const handleAgentSelect = (agent: LocalAgent | FetchAIAgent) => {
    setSelectedAgent(agent)
    setShowDetails(true)
  }

  const handleStartChat = async (agentId: string) => {
    try {
      await connectToAgent(agentId)
      // Handle successful connection
      console.log(`Connected to agent: ${agentId}`)
    } catch (error) {
      console.error(`Failed to connect to agent ${agentId}:`, error)
    }
  }

  const getAgentStatusColor = (agentId: string) => {
    const status = agentStatuses.get(agentId) || 'offline'
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'busy': return 'bg-yellow-500'
      case 'offline': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getAgentStatusText = (agentId: string) => {
    const status = agentStatuses.get(agentId) || 'offline'
    switch (status) {
      case 'online': return 'Online'
      case 'busy': return 'Busy'
      case 'offline': return 'Offline'
      default: return 'Unknown'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'blockchain': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'ai_assistant': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'data_analyst': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'defi': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'trading': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'customer_support': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Agent Selection</h1>
          <p className="text-muted-foreground">
            Choose from our network of specialized AI agents to assist with your blockchain operations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Manage
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search agents by name, description, or capabilities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <category.icon className="h-4 w-4" />
                        {category.label} ({category.count})
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agent Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
        {categories.map(category => (
          <Card 
            key={category.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedCategory === category.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <CardContent className="p-4 text-center">
              <category.icon className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <h3 className="text-sm font-medium">{category.label}</h3>
              <p className="text-xs text-muted-foreground">{category.count} agents</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Local Agents */}
        {filteredAgents.map(agent => (
          <Card 
            key={agent.id}
            className="cursor-pointer transition-all hover:shadow-lg"
            onClick={() => handleAgentSelect(agent)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${getAgentStatusColor(agent.id)}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{agent.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {getAgentStatusText(agent.id)}
                    </p>
                  </div>
                </div>
                <Badge className={getRoleColor(agent.role)}>
                  {agent.role.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {agent.description}
              </p>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Capabilities:</h4>
                <div className="flex flex-wrap gap-1">
                  {agent.capabilities.slice(0, 3).map(capability => (
                    <Badge key={capability} variant="outline" className="text-xs">
                      {capability.replace('-', ' ')}
                    </Badge>
                  ))}
                  {agent.capabilities.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{agent.capabilities.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {agent.price !== undefined && (
                    <span className="text-sm font-medium">
                      {agent.price === 0 ? 'Free' : `${agent.price} FET`}
                    </span>
                  )}
                </div>
                <Button 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleStartChat(agent.id)
                  }}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Fetch.ai Agents */}
        {filteredFetchAIAgents.map(agent => (
          <Card 
            key={agent.id}
            className="cursor-pointer transition-all hover:shadow-lg border-dashed"
            onClick={() => handleAgentSelect(agent)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                      <Globe className="h-6 w-6 text-white" />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${getAgentStatusColor(agent.id)}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{agent.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {getAgentStatusText(agent.id)}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="border-green-500 text-green-700">
                  Fetch.ai
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {agent.description}
              </p>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Capabilities:</h4>
                <div className="flex flex-wrap gap-1">
                  {agent.capabilities.slice(0, 3).map(capability => (
                    <Badge key={capability} variant="outline" className="text-xs">
                      {capability.replace('-', ' ')}
                    </Badge>
                  ))}
                  {agent.capabilities.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{agent.capabilities.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {agent.price !== undefined && (
                    <span className="text-sm font-medium">
                      {agent.price === 0 ? 'Free' : `${agent.price} FET`}
                    </span>
                  )}
                </div>
                <Button 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleStartChat(agent.id)
                  }}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {(filteredAgents.length === 0 && filteredFetchAIAgents.length === 0) && (
        <Card>
          <CardContent className="p-8 text-center">
            <Bot className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No agents found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or selecting a different category
            </p>
            <Button variant="outline" onClick={() => {
              setSearchTerm('')
              setSelectedCategory('all')
            }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Agent Details Modal */}
      {showDetails && selectedAgent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Bot className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{selectedAgent.name}</h2>
                    <p className="text-muted-foreground">
                      {getAgentStatusText(selectedAgent.id)}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowDetails(false)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{selectedAgent.description}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Capabilities</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedAgent.capabilities.map(capability => (
                    <Badge key={capability} variant="outline">
                      {capability.replace('-', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  className="flex-1"
                  onClick={() => {
                    handleStartChat(selectedAgent.id)
                    setShowDetails(false)
                  }}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Start Chat
                </Button>
                <Button variant="outline" onClick={() => setShowDetails(false)}>
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
