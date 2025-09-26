'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Wallet, 
  Bot, 
  User, 
  Power, 
  PowerOff, 
  Settings,
  Trash2,
  Copy,
  Check
} from 'lucide-react'

interface DelegatedWallet {
  id: string
  address: string
  name: string
  type: 'bot_pol' | 'bot_eth' | 'bot_matic' | 'user_delegated'
  isActive: boolean
  permissions: string[]
  createdAt: string
  lastUsed: string
}

interface DelegatedWalletCardProps {
  wallet: DelegatedWallet
  onToggleStatus: (walletId: string, isActive: boolean) => void
  onDelete?: (walletId: string) => void
}

export function DelegatedWalletCard({ wallet, onToggleStatus, onDelete }: DelegatedWalletCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [newName, setNewName] = useState(wallet.name)
  const [copied, setCopied] = useState(false)

  const getWalletIcon = (type: string) => {
    switch (type) {
      case 'bot_pol':
      case 'bot_eth':
      case 'bot_matic':
        return <Bot className="h-5 w-5" />
      case 'user_delegated':
        return <User className="h-5 w-5" />
      default:
        return <Wallet className="h-5 w-5" />
    }
  }

  const getWalletTypeColor = (type: string) => {
    switch (type) {
      case 'bot_pol': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'bot_eth': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'bot_matic': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      case 'user_delegated': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(wallet.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy address:', error)
    }
  }

  const handleSaveName = () => {
    // TODO: Implement name update API call
    setIsEditing(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getWalletIcon(wallet.type)}
            <div>
              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="h-8 w-48"
                  />
                  <Button size="sm" onClick={handleSaveName}>
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <CardTitle className="text-lg">{wallet.name}</CardTitle>
              )}
              <CardDescription className="flex items-center space-x-2">
                <span className="font-mono text-sm">{wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={copyAddress}
                  className="h-6 w-6 p-0"
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getWalletTypeColor(wallet.type)}>
              {wallet.type.replace('_', ' ').toUpperCase()}
            </Badge>
            <Badge variant={wallet.isActive ? 'default' : 'secondary'}>
              {wallet.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Permissions */}
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Permissions</Label>
            <div className="flex flex-wrap gap-1 mt-1">
              {wallet.permissions.map((permission, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {permission.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </div>

          {/* Wallet Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="text-gray-700 dark:text-gray-300">Created</Label>
              <p className="text-gray-600 dark:text-gray-400">{formatDate(wallet.createdAt)}</p>
            </div>
            <div>
              <Label className="text-gray-700 dark:text-gray-300">Last Used</Label>
              <p className="text-gray-600 dark:text-gray-400">{formatDate(wallet.lastUsed)}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Settings className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToggleStatus(wallet.id, !wallet.isActive)}
                className={wallet.isActive ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
              >
                {wallet.isActive ? (
                  <>
                    <PowerOff className="h-4 w-4 mr-1" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <Power className="h-4 w-4 mr-1" />
                    Activate
                  </>
                )}
              </Button>
            </div>
            {onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(wallet.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
