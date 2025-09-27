'use client'

import { useState, useRef, useEffect } from 'react'
import { Message, ChatSession } from '@/types/chat'
import { MessageBubble } from './message-bubble'
import { MessageInput } from './message-input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Bot, Phone, Video, MoreVertical, X } from 'lucide-react'

interface ChatInterfaceProps {
  session: ChatSession | null
  onSendMessage: (message: string) => void
  onEndSession: () => void
  onTransferAgent: () => void
}

export function ChatInterface({ session, onSendMessage, onEndSession, onTransferAgent }: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showOptions, setShowOptions] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [session?.messages])

  if (!session) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/50">
        <div className="text-center">
          <Bot className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Active Chat</h3>
          <p className="text-muted-foreground">Start a conversation with an agent</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={`/avatars/${session.agentId}.jpg`} />
            <AvatarFallback>
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{session.agentName}</h3>
            <p className="text-sm text-muted-foreground">Online</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-4 w-4" />
          </Button>
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowOptions(!showOptions)}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
            
            {showOptions && (
              <div className="absolute right-0 top-10 w-48 bg-background border rounded-md shadow-lg z-10">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={onTransferAgent}
                >
                  Transfer to another agent
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-destructive"
                  onClick={onEndSession}
                >
                  End conversation
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {session.messages.map((message) => (
          <MessageBubble 
            key={message.id} 
            message={message}
            isLast={message.id === session.messages[session.messages.length - 1]?.id}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput 
        onSendMessage={onSendMessage}
        placeholder={`Message ${session.agentName}...`}
      />
    </div>
  )
}
