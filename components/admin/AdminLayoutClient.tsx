'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Coins, 
  Settings, 
  Menu, 
  X, 
  Globe, 
  LogOut,
  User,
  ShieldCheck
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface AdminProfile {
  id: string
  email: string
  full_name: string | null
  role: string
}

interface AdminLayoutClientProps {
  children: React.ReactNode
  profile: AdminProfile
}

export function AdminLayoutClient({ children, profile }: AdminLayoutClientProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push('/login')
  }

  const navItems = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard
    },
    {
      name: 'Listings',
      href: '/admin/listings',
      icon: FileText
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: Users
    },
    {
      name: 'Transactions',
      href: '/admin/transactions',
      icon: Coins
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings
    }
  ]

  // Get first letter of name or email for avatar
  const avatarLetter = (profile.full_name || profile.email || 'A')[0].toUpperCase()

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f1ec] text-[#111111] antialiased">
      {/* 1. WordPress style Top Admin Bar */}
      <header className="sticky top-0 z-50 h-11 flex items-center justify-between bg-[#1d2327] text-[#e0e0e0] px-4 select-none text-[13px] border-b border-[#2c3338]">
        {/* Left Side: Logo & Quick Links */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-1 rounded hover:bg-[#2c3338] text-[#e0e0e0] focus:outline-none"
            aria-label="Toggle Navigation Sidebar"
          >
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          <Link href="/" className="flex items-center gap-2 group hover:text-white font-bold transition-colors">
            <svg viewBox="0 0 100 100" className="h-5 w-5 fill-[#f0a500]" fillRule="evenodd">
              <rect width="100" height="100" rx="16" />
              <path d="M30 18h15c20 0 35 12 35 32s-15 32-35 32H30c-4.4 0-8-3.6-8-8V26c0-4.4 3.6-8 8-8zm13 14H35v36h8c11 0 19-7 19-18s-8-18-19-18z" fill="#ffffff" />
            </svg>
            <span className="hidden sm:inline text-[#f0a500] font-black tracking-wide">DRIVERS AUSTRALIA</span>
            <span className="text-[11px] bg-[#2c3338] px-1.5 py-0.5 rounded text-neutral-400 font-normal">Admin</span>
          </Link>

          <div className="h-4 w-[1px] bg-[#2c3338] hidden sm:block" />

          <Link 
            href="/"
            className="hidden sm:flex items-center gap-1.5 hover:text-white transition-colors py-1 px-2 rounded hover:bg-[#2c3338]"
          >
            <Globe className="h-3.5 w-3.5" />
            <span>Visit Site</span>
          </Link>
        </div>

        {/* Right Side: Howdy User & Logout */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-neutral-400 hidden sm:inline">Howdy,</span>
            <span className="font-semibold text-white">{profile.full_name || profile.email}</span>
            <div className="h-6 w-6 rounded-full bg-[#f0a500] text-white flex items-center justify-center font-bold text-xs">
              {avatarLetter}
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-1 hover:text-red-400 transition-colors py-1 px-2 rounded hover:bg-[#2c3338] cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Log Out</span>
          </button>
        </div>
      </header>

      <div className="flex flex-grow relative">
        {/* 2. WordPress style Left Sidebar */}
        <aside 
          className={cn(
            "fixed inset-y-11 left-0 z-40 w-48 bg-[#23282d] text-[#c3c4c7] flex flex-col justify-between transition-transform duration-300 md:translate-x-0 border-r border-[#2c3338] md:sticky md:h-[calc(100vh-44px)]",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Main Navigation Links */}
          <nav className="py-2 flex-grow space-y-0.5" aria-label="Sidebar Admin Menu">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 text-[14px] font-medium transition-all duration-150 border-l-[4px] border-transparent hover:bg-[#1d2327] hover:text-[#72aee6]",
                    isActive 
                      ? "bg-[#1d2327] text-white border-l-[4px] border-l-[#f0a500]" 
                      : "text-[#c3c4c7]"
                  )}
                >
                  <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-[#f0a500]" : "text-neutral-400")} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Sidebar Footer info */}
          <div className="p-4 border-t border-[#2c3338] text-[10px] text-neutral-500 space-y-1 select-none">
            <p className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-neutral-400" />
              <span>Version 1.0.0</span>
            </p>
            <p>© Drivers Australia</p>
          </div>
        </aside>

        {/* Backdrop for mobile navigation */}
        {sidebarOpen && (
          <div 
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
            style={{ top: '44px' }}
          />
        )}

        {/* 3. Main Dashboard Workspace */}
        <main className="flex-grow min-w-0 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
