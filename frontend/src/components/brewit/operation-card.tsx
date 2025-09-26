'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Play, 
  Pause, 
  Square, 
  Trash2, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Settings
} from 'lucide-react'

interface AutomatedOperation {
  id: string
  name: string
  task: string
  status: string
  scheduledAt: string
  lastExecuted?: string
  walletAddress: string
  repeatInterval?: number
  maxExecutions?: number
}

interface OperationCardProps {
  operation: AutomatedOperation
  onDelete: (operationId: string) => void
  onPause?: (operationId: string) => void
  onResume?: (operationId: string) => void
}

export function OperationCard({ operation, onDelete, onPause, onResume }: OperationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'RUNNING':
        return <Play className="h-4 w-4 text-blue-500" />
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'CANCELLED':
        return <Square className="h-4 w-4 text-gray-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'RUNNING': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'COMPLETED': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'FAILED': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'CANCELLED': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getTaskIcon = (task: string) => {
    switch (task) {
      case 'send': return '📤'
      case 'swap': return '🔄'
      case 'stake': return '🔒'
      case 'unstake': return '🔓'
      case 'claim': return '💰'
      default: return '⚙️'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatInterval = (interval?: number) => {
    if (!interval) return 'N/A'
    const seconds = Math.floor(interval / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ${hours % 24}h`
    if (hours > 0) return `${hours}h ${minutes % 60}m`
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`
    return `${seconds}s`
  }

  const canPause = operation.status === 'SCHEDULED' || operation.status === 'RUNNING'
  const canResume = operation.status === 'CANCELLED' || operation.status === 'PAUSED'

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getTaskIcon(operation.task)}</span>
            <div>
              <CardTitle className="text-lg">{operation.name}</CardTitle>
              <CardDescription className="font-mono text-sm">
                {operation.walletAddress.slice(0, 8)}...{operation.walletAddress.slice(-6)}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {getStatusIcon(operation.status)}
              <Badge className={getStatusColor(operation.status)}>
                {operation.status}
              </Badge>
            </div>
            <Badge variant="outline">
              {operation.task.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">Scheduled</span>
              <p className="text-gray-600 dark:text-gray-400">{formatDate(operation.scheduledAt)}</p>
            </div>
            {operation.lastExecuted && (
              <div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">Last Executed</span>
                <p className="text-gray-600 dark:text-gray-400">{formatDate(operation.lastExecuted)}</p>
              </div>
            )}
          </div>

          {/* Expanded Details */}
          {isExpanded && (
            <div className="space-y-3 pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Repeat Interval</span>
                  <p className="text-gray-600 dark:text-gray-400">{formatInterval(operation.repeatInterval)}</p>
                </div>
                <div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Max Executions</span>
                  <p className="text-gray-600 dark:text-gray-400">{operation.maxExecutions || 'Unlimited'}</p>
                </div>
              </div>
              
              <div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">Wallet Address</span>
                <p className="text-gray-600 dark:text-gray-400 font-mono text-xs break-all">
                  {operation.walletAddress}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <Settings className="h-4 w-4 mr-1" />
                {isExpanded ? 'Less' : 'Details'}
              </Button>
              
              {canPause && onPause && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPause(operation.id)}
                  className="text-orange-600 hover:text-orange-700"
                >
                  <Pause className="h-4 w-4 mr-1" />
                  Pause
                </Button>
              )}
              
              {canResume && onResume && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onResume(operation.id)}
                  className="text-green-600 hover:text-green-700"
                >
                  <Play className="h-4 w-4 mr-1" />
                  Resume
                </Button>
              )}
            </div>
            
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(operation.id)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
