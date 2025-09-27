'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Bot, 
  BarChart3, 
  Wallet, 
  Settings,
  ChevronRight,
  Zap
} from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    current: true
  },
  {
    name: 'AI Agents',
    href: '/agents',
    icon: Bot,
    current: false
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    current: false
  },
  {
    name: 'Payments',
    href: '/payments',
    icon: Wallet,
    current: false
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    current: false
  }
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-gradient-to-b from-gray-900/95 to-gray-800/95 backdrop-blur-sm border-r border-gray-700/50">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-gray-700/50">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-kadena-500 to-kadena-600">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AI DeFi</h1>
            <p className="text-xs text-gray-400">Kadena dApp</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-kadena-500/20 to-kadena-600/20 text-kadena-400 border border-kadena-500/30 shadow-lg shadow-kadena-500/10'
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-kadena-400' : 'text-gray-400 group-hover:text-white'}`} />
              <span className="flex-1">{item.name}</span>
              {isActive && (
                <ChevronRight className="h-4 w-4 text-kadena-400" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-gray-700/50">
        <div className="rounded-xl bg-gradient-to-r from-kadena-500/10 to-purple-500/10 p-4 border border-kadena-500/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-white">System Status</span>
          </div>
          <p className="text-xs text-gray-400">
            All systems operational
          </p>
        </div>
      </div>
    </div>
  )
}