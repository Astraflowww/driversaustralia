'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { TokenBadge } from './TokenBadge'
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
  LogIn
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
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push('/login')
  }

  const role = profile?.role

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
                  <span className="text-[16px] font-black tracking-normal text-foreground leading-[1.05] mt-0.5">AUSTRALIA</span>
                </div>
                <div className="text-[8px] font-medium text-foreground/80 self-stretch flex items-end pl-0.5 pb-[2px] select-none" style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}>
                  .com.au
                </div>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1.5">
              <Link
                href="/"
                className="text-sm font-medium px-3 py-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-200"
              >
                Browse
              </Link>
              <Link
                href="/pricing"
                className="text-sm font-medium px-3 py-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-200"
              >
                Pricing
              </Link>
              <Link
                href="/faq"
                className="text-sm font-medium px-3 py-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-200"
              >
                FAQ
              </Link>

              {role === 'seller' && (
                <>
                  <Link
                    href="/seller/dashboard"
                    className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-200"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    href="/seller/listings/new"
                    className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-200"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Create Listing
                  </Link>
                </>
              )}

              {role === 'admin' && (
                <>
                  <Link
                    href="/admin/dashboard"
                    className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-200"
                  >
                    <Shield className="h-4 w-4" />
                    Admin
                  </Link>
                  <Link
                    href="/admin/listings"
                    className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-200"
                  >
                    <ListCollapse className="h-4 w-4" />
                    Listings Queue
                  </Link>
                  <Link
                    href="/admin/users"
                    className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-200"
                  >
                    <Users className="h-4 w-4" />
                    Manage Users
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right Action Section */}
          <div className="hidden md:flex items-center gap-4">
            {profile ? (
              <div className="flex items-center gap-4">
                {role === 'seller' && (
                  <TokenBadge tokens={profile.tokens} />
                )}
                
                <div className="flex flex-col text-right">
                  <span className="text-sm font-semibold max-w-[150px] truncate">
                    {profile.full_name || 'User'}
                  </span>
                  <span className="text-[10px] text-muted-foreground capitalize">
                    {role === 'seller' ? 'Business Owner' : role === 'buyer' ? 'Driver' : role}
                  </span>
                </div>

                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="gap-2 cursor-pointer">
                    <LogIn className="h-4 w-4" />
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                  >
                    Sign Up
                  </Button>
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
              className="rounded-lg p-2 hover:bg-secondary text-muted-foreground hover:text-foreground focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

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
    </nav>
  )
}
