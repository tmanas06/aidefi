'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MessageCircle, Settings, BarChart3, Users, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'agents', label: 'Agents', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="w-64 bg-background border-r flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold">AgentChat</h1>
        <p className="text-sm text-muted-foreground">B2C Agent Communication</p>
      </div>
      
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start',
                  activeTab === tab.id && 'bg-primary/10 text-primary'
                )}
                onClick={() => onTabChange(tab.id)}
              >
                <Icon className="h-4 w-4 mr-3" />
                {tab.label}
              </Button>
            )
          })}
        </div>
      </nav>
      
      <div className="p-4 border-t">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-sm font-medium text-primary-foreground">U</span>
          </div>
          <div>
            <p className="text-sm font-medium">User</p>
            <p className="text-xs text-muted-foreground">Customer</p>
          </div>
        </div>
      </div>
    </div>
  )
}
