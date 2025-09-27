'use client'

import { useState } from 'react'
import { Sidebar } from './sidebar'
import { ChatDashboard } from '@/components/dashboard/chat-dashboard'
import { AnalyticsDashboard } from '@/components/analytics/analytics-dashboard'
import { EcommerceDashboard } from '@/components/ecommerce/ecommerce-dashboard'
import { Button } from '@/components/ui/button'
import { MessageCircle, Users, BarChart3, Bell, Settings, ShoppingBag } from 'lucide-react'

export function MainLayout() {
  const [activeTab, setActiveTab] = useState('chat')

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatDashboard onStartNewChat={() => {}} />
      case 'agents':
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Agent Management</h3>
              <p className="text-muted-foreground">Manage your agents and their availability</p>
            </div>
          </div>
        )
      case 'analytics':
        return <AnalyticsDashboard />
      case 'marketplace':
        return <EcommerceDashboard />
      case 'notifications':
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Notifications</h3>
              <p className="text-muted-foreground">Manage your notification preferences</p>
            </div>
          </div>
        )
      case 'settings':
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Settings className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Settings</h3>
              <p className="text-muted-foreground">Configure your chat preferences</p>
            </div>
          </div>
        )
      default:
        return <ChatDashboard onStartNewChat={() => {}} />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}
