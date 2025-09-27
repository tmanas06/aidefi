'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { NFT } from '@/lib/analytics-service'
import { Image, ExternalLink, Eye, Heart } from 'lucide-react'

interface NFTGalleryProps {
  nfts: NFT[]
  loading?: boolean
}

export function NFTGallery({ nfts, loading }: NFTGalleryProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null)

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            NFT Collection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-muted rounded-lg mb-2"></div>
                <div className="h-4 bg-muted rounded mb-1"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (nfts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            NFT Collection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Image className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No NFTs found in this wallet</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              NFT Collection ({nfts.length})
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                List
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {nfts.map((nft) => (
                <Card 
                  key={`${nft.contractAddress}-${nft.tokenId}`}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedNFT(nft)}
                >
                  <CardContent className="p-0">
                    <div className="aspect-square relative overflow-hidden rounded-t-lg">
                      {nft.image ? (
                        <img 
                          src={nft.image} 
                          alt={nft.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Image className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium truncate">{nft.name}</h4>
                      <p className="text-sm text-muted-foreground truncate">{nft.collectionName}</p>
                      {nft.floorPrice && (
                        <div className="flex items-center gap-1 mt-2">
                          <Badge variant="outline" className="text-xs">
                            Floor: {nft.floorPrice.toFixed(2)} ETH
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {nfts.map((nft) => (
                <Card 
                  key={`${nft.contractAddress}-${nft.tokenId}`}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedNFT(nft)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 relative overflow-hidden rounded-lg">
                        {nft.image ? (
                          <img 
                            src={nft.image} 
                            alt={nft.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <Image className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{nft.name}</h4>
                        <p className="text-sm text-muted-foreground">{nft.collectionName}</p>
                        {nft.traits && nft.traits.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {nft.traits.slice(0, 3).map((trait, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {trait.trait_type}: {trait.value}
                              </Badge>
                            ))}
                            {nft.traits.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{nft.traits.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        {nft.floorPrice && (
                          <p className="font-medium">{nft.floorPrice.toFixed(2)} ETH</p>
                        )}
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* NFT Detail Modal */}
      {selectedNFT && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="aspect-square relative overflow-hidden">
                  {selectedNFT.image ? (
                    <img 
                      src={selectedNFT.image} 
                      alt={selectedNFT.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Image className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-2">{selectedNFT.name}</h2>
                  <p className="text-muted-foreground mb-4">{selectedNFT.collectionName}</p>
                  
                  {selectedNFT.description && (
                    <p className="text-sm mb-4">{selectedNFT.description}</p>
                  )}

                  {selectedNFT.traits && selectedNFT.traits.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Traits</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedNFT.traits.map((trait, index) => (
                          <div key={index} className="border rounded p-2">
                            <p className="text-xs text-muted-foreground">{trait.trait_type}</p>
                            <p className="font-medium text-sm">{trait.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <Button size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on OpenSea
                    </Button>
                    <Button size="sm" variant="outline">
                      <Heart className="h-4 w-4 mr-2" />
                      Add to Watchlist
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <div className="p-4 border-t">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setSelectedNFT(null)}
              >
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
