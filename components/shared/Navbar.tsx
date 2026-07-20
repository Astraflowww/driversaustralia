'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { TokenBadge } from './TokenBadge'
import { UnreadBadge } from '../messaging/UnreadBadge'
import { 
  Menu, 
  X, 
  Sparkles, 
  LogOut, 
  LayoutDashboard, 
  PlusCircle, 
  Shield, 
  Users, 
  ListCollapse, 
  LogIn,
  MessageSquare
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Profile {
  id: string
  email: string
  full_name: string | null
  role: 'buyer' | 'seller' | 'admin'
  tokens: number
}

interface NavbarProps {
  profile: Profile | null
}

export function Navbar({ profile }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  // Hide the main public navbar on admin pages to prevent duplicate navbar
  if (pathname?.startsWith('/admin')) {
    return null
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push('/login')
  }

  const role = profile?.role

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#17191a] border-b-3 border-[#ffb81c]">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-7">
          <div className="flex h-16 items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2.5 group select-none">
                <div className="transition-transform duration-200 group-hover:scale-[1.02] shrink-0">
                  <svg viewBox="0 0 100 100" className="h-9 w-9" fillRule="evenodd">
                    <rect width="100" height="100" rx="16" fill="#f0a500" />
                    <path d="M30 18h15c20 0 35 12 35 32s-15 32-35 32H30c-4.4 0-8-3.6-8-8V26c0-4.4 3.6-8 8-8zm13 14H35v36h8c11 0 19-7 19-18s-8-18-19-18z" fill="#ffffff" />
                  </svg>
                </div>
                <div className="flex items-center">
                  <div className="flex flex-col leading-none">
                    <span className="text-[19px] font-bold tracking-[0.03em] text-[#f0a500] leading-[1.05]">DRIVERS</span>
                    <span className="text-[16px] font-black tracking-normal text-white leading-[1.05] mt-0.5">AUSTRALIA</span>
                  </div>
                  <div className="text-[8px] font-medium text-[#b9bcb2] self-stretch flex items-end pl-0.5 pb-[2px] select-none" style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}>
                    .com.au
                  </div>
                </div>
              </Link>

              {/* Desktop Navigation Links */}
              <div className="hidden md:flex items-center gap-5">
                <Link
                  href="/"
                  className="text-xs font-bold uppercase tracking-[0.04em] text-[#b9bcb2] hover:text-[#f2efe6] transition-colors"
                >
                  Browse
                </Link>
                <Link
                  href="/pricing"
                  className="text-xs font-bold uppercase tracking-[0.04em] text-[#b9bcb2] hover:text-[#f2efe6] transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  href="/faq"
                  className="text-xs font-bold uppercase tracking-[0.04em] text-[#b9bcb2] hover:text-[#f2efe6] transition-colors"
                >
                  FAQ
                </Link>

                {profile && (
                  <Link
                    href="/messages"
                    className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.04em] text-[#b9bcb2] hover:text-[#f2efe6] transition-colors"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    Messages
                    <UnreadBadge />
                  </Link>
                )}

                {role === 'seller' && (
                  <>
                    <Link
                      href="/seller/dashboard"
                      className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.04em] text-[#ffb81c] hover:text-[#f2efe6] transition-colors"
                    >
                      <LayoutDashboard className="h-3.5 w-3.5" />
                      Dashboard
                    </Link>
                    <Link
                      href="/seller/listings/new"
                      className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.04em] text-[#ffb81c] hover:text-[#f2efe6] transition-colors"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      Create Listing
                    </Link>
                  </>
                )}

                {role === 'admin' && (
                  <>
                    <Link
                      href="/admin/dashboard"
                      className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.04em] text-[#ffb81c] hover:text-[#f2efe6] transition-colors"
                    >
                      <Shield className="h-3.5 w-3.5" />
                      Admin
                    </Link>
                    <Link
                      href="/admin/listings"
                      className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.04em] text-[#b9bcb2] hover:text-[#f2efe6] transition-colors"
                    >
                      <ListCollapse className="h-3.5 w-3.5" />
                      Listings Queue
                    </Link>
                    <Link
                      href="/admin/users"
                      className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.04em] text-[#b9bcb2] hover:text-[#f2efe6] transition-colors"
                    >
                      <Users className="h-3.5 w-3.5" />
                      Manage Users
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Right Action Section */}
            <div className="hidden md:flex items-center gap-3">
              {profile ? (
                <div className="flex items-center gap-4">
                  {role === 'seller' && (
                    <TokenBadge tokens={profile.tokens} />
                  )}
                  
                  <div className="flex flex-col text-right">
                    <span className="text-xs font-bold text-[#f2efe6] max-w-[140px] truncate">
                      {profile.full_name || 'User'}
                    </span>
                    <span className="text-[10px] text-[#b9bcb2] uppercase tracking-wider">
                      {role === 'seller' ? 'Business Owner' : role === 'buyer' ? 'Driver' : role}
                    </span>
                  </div>

                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-[#b9bcb2] hover:text-white hover:bg-white/10 cursor-pointer text-xs uppercase font-bold"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <Link href="/login">
                    <button className="font-bold text-xs uppercase tracking-wider text-[#f2efe6] border-2 border-[#f2efe6] px-4 py-2 rounded-[4px] hover:bg-[#f2efe6] hover:text-[#15170f] transition-all cursor-pointer">
                      Sign In
                    </button>
                  </Link>
                  <Link href="/register?role=seller">
                    <button className="font-bold text-xs uppercase tracking-wider text-[#15170f] bg-[#ffb81c] px-4 py-2 rounded-[4px] hover:bg-[#d99400] transition-all cursor-pointer shadow-sm">
                      Post a Job
                    </button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-3">
              {profile && role === 'seller' && (
                <TokenBadge tokens={profile.tokens} showText={false} />
              )}
              
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="rounded-lg p-2 text-[#b9bcb2] hover:text-white focus:outline-none"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>
      <div className="lane" />

      {/* Mobile Menu panel */}
      {isOpen && (
        <div className="border-b border-border/40 bg-background/95 md:hidden animate-in slide-in-from-top duration-300">
          <div className="space-y-1 px-4 py-4 pb-6">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="block rounded-lg px-3 py-2 text-base font-medium hover:bg-secondary"
            >
              Browse
            </Link>
            <Link
              href="/pricing"
              onClick={() => setIsOpen(false)}
              className="block rounded-lg px-3 py-2 text-base font-medium hover:bg-secondary"
            >
              Pricing
            </Link>
            <Link
              href="/faq"
              onClick={() => setIsOpen(false)}
              className="block rounded-lg px-3 py-2 text-base font-medium hover:bg-secondary"
            >
              FAQ
            </Link>


            {role === 'seller' && (
              <>
                <Link
                  href="/seller/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg px-3 py-2 text-base font-medium hover:bg-secondary"
                >
                  Operator Dashboard
                </Link>
                <Link
                  href="/seller/listings/new"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg px-3 py-2 text-base font-medium hover:bg-secondary"
                >
                  Create Listing (-1 Token)
                </Link>
              </>
            )}

            {role === 'admin' && (
              <>
                <Link
                  href="/admin/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg px-3 py-2 text-base font-medium hover:bg-secondary"
                >
                  Admin Dashboard
                </Link>
                <Link
                  href="/admin/listings"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg px-3 py-2 text-base font-medium hover:bg-secondary"
                >
                  Listings Queue
                </Link>
                <Link
                  href="/admin/users"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg px-3 py-2 text-base font-medium hover:bg-secondary"
                >
                  Manage Users
                </Link>
              </>
            )}

            <div className="border-t border-border/40 my-4 pt-4">
              {profile ? (
                <div className="space-y-3">
                  <div className="px-3">
                    <p className="text-sm font-semibold">{profile.full_name || 'User'}</p>
                    <p className="text-xs text-muted-foreground capitalize">{profile.role}</p>
                  </div>
                  <Button
                    onClick={() => {
                      setIsOpen(false)
                      handleLogout()
                    }}
                    variant="ghost"
                    className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 px-3">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-primary text-primary-foreground">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
