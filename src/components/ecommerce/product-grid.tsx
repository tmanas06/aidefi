"use client"

import { useState, useEffect } from 'react'
import { ProductCard } from './product-card'
import { Product, merchantService } from '@/lib/merchant-service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, RefreshCw, Filter, Loader2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface ProductGridProps {
  onPurchaseComplete?: (result: { success: boolean; txHash?: string; message: string; product?: Product }) => void
}

export function ProductGrid({ onPurchaseComplete }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [merchantStatus, setMerchantStatus] = useState<'online' | 'offline' | 'checking'>('checking')

  // Load products on component mount
  useEffect(() => {
    loadProducts()
    checkMerchantStatus()
  }, [])

  // Filter products when search query or category changes
  useEffect(() => {
    let filtered = products

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        (product.description && product.description.toLowerCase().includes(query)) ||
        (product.category && product.category.toLowerCase().includes(query))
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    setFilteredProducts(filtered)
  }, [products, searchQuery, selectedCategory])

  const loadProducts = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Use the enhanced getAllProducts method that includes marketplace data
      const productList = await merchantService.getAllProducts()
      setProducts(productList)
    } catch (error) {
      console.error('Error loading products:', error)
      setError('Failed to load products. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const checkMerchantStatus = async () => {
    setMerchantStatus('checking')
    const isOnline = await merchantService.checkHealth()
    setMerchantStatus(isOnline ? 'online' : 'offline')
  }

  const handlePurchaseStart = (product: Product) => {
    console.log('Starting purchase for:', product.name)
  }

  const handlePurchaseComplete = (result: { success: boolean; txHash?: string; message: string }) => {
    onPurchaseComplete?.(result)
    
    // Show success/error message
    if (result.success) {
      console.log('Purchase successful:', result.txHash)
    } else {
      console.error('Purchase failed:', result.message)
    }
  }

  const getCategories = () => {
    const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)))
    return categories.sort()
  }

  const getMerchantStatusBadge = () => {
    switch (merchantStatus) {
      case 'online':
        return <Badge variant="default" className="bg-green-100 text-green-800">Online</Badge>
      case 'offline':
        return <Badge variant="destructive">Offline</Badge>
      case 'checking':
        return <Badge variant="secondary">Checking...</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Marketplace</h2>
          <p className="text-muted-foreground">
            Discover and purchase products using cryptocurrency
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Merchant Status:</span>
          {getMerchantStatusBadge()}
          <Button
            variant="outline"
            size="sm"
            onClick={checkMerchantStatus}
            disabled={merchantStatus === 'checking'}
          >
            <RefreshCw className={`h-4 w-4 ${merchantStatus === 'checking' ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Merchant Status Alert */}
      {merchantStatus === 'offline' && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Merchant service is currently offline. You're viewing cached products. 
            Some features may not work properly.
          </AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button
              variant="outline"
              size="sm"
              onClick={loadProducts}
              className="ml-2"
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Categories</option>
                {getCategories().map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onPurchaseStart={handlePurchaseStart}
                  onPurchaseComplete={handlePurchaseComplete}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  {searchQuery || selectedCategory !== 'all' 
                    ? 'No products match your search criteria.' 
                    : 'No products available at the moment.'}
                </p>
                {(searchQuery || selectedCategory !== 'all') && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedCategory('all')
                    }}
                    className="mt-4"
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          {filteredProducts.length > 0 ? (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <Card key={product.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        {product.description && (
                          <p className="text-muted-foreground text-sm mt-1">
                            {product.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          {product.category && (
                            <Badge variant="outline">{product.category}</Badge>
                          )}
                          <span className="text-lg font-bold text-primary">
                            {product.price_tokens ? `${product.price_tokens} ${product.currency || 'rUSDT'}` : `$${product.price_usd?.toFixed(2)}`}
                          </span>
                        </div>
                      </div>
                      
                      <div className="ml-4">
                        <ProductCard
                          product={product}
                          onPurchaseStart={handlePurchaseStart}
                          onPurchaseComplete={handlePurchaseComplete}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  {searchQuery || selectedCategory !== 'all' 
                    ? 'No products match your search criteria.' 
                    : 'No products available at the moment.'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Results Summary */}
      {filteredProducts.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          Showing {filteredProducts.length} of {products.length} products
          {(searchQuery || selectedCategory !== 'all') && ' (filtered)'}
        </div>
      )}
    </div>
  )
}
