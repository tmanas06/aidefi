'use client'

import { Message } from '@/types/chat'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatTime } from '@/lib/utils'
import { Bot, User, AlertCircle } from 'lucide-react'

interface MessageBubbleProps {
  message: Message
  isLast?: boolean
}

export function MessageBubble({ message, isLast }: MessageBubbleProps) {
  const isUser = message.sender === 'user'
  const isSystem = message.sender === 'system'
  
  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm text-muted-foreground">
          <AlertCircle className="h-4 w-4" />
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage src={message.agentId ? `/avatars/${message.agentId}.jpg` : undefined} />
        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>
      
      <div className={`flex flex-col max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className="flex items-center gap-2 mb-1">
          {!isUser && message.agentName && (
            <span className="text-xs font-medium text-muted-foreground">
              {message.agentName}
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            {formatTime(message.timestamp)}
          </span>
        </div>
        
        <div
          className={`px-4 py-2 rounded-2xl ${
            isUser
              ? 'bg-primary text-primary-foreground rounded-br-md'
              : 'bg-muted text-foreground rounded-bl-md'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
        
        {message.isTyping && (
          <div className="flex gap-1 mt-2">
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        )}
      </div>
    </div>
  )
}
