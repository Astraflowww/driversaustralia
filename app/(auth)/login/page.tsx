'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Sparkles, Loader2, ArrowRight, Eye, EyeOff, Lock, Mail, UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Focus states for premium visual feedback
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        throw signInError
      }

      if (data?.user) {
        // Fetch profile to determine role and redirect
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        router.refresh()
        
        if (profile?.role === 'admin') {
          router.push('/admin/dashboard')
        } else if (profile?.role === 'seller') {
          router.push('/seller/dashboard')
        } else {
          router.push(redirect)
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-[420px] border border-border/60 bg-card shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 relative overflow-hidden group">
      <CardHeader className="space-y-1.5 text-center pb-4 pt-6 px-6">
        <div className="mx-auto mb-3.5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0a500]/10 border border-[#f0a500]/20 text-[#f0a500] shadow-sm transition-transform duration-300 hover:scale-105">
          <svg viewBox="0 0 100 100" className="h-7 w-7" fillRule="evenodd">
            <rect width="100" height="100" rx="16" fill="#f0a500" />
            <path d="M30 18h15c20 0 35 12 35 32s-15 32-35 32H30c-4.4 0-8-3.6-8-8V26c0-4.4 3.6-8 8-8zm13 14H35v36h8c11 0 19-7 19-18s-8-18-19-18z" fill="#ffffff" />
          </svg>
        </div>
        <CardTitle className="text-2xl font-semibold tracking-tight text-foreground">Welcome back</CardTitle>
        <CardDescription className="text-sm text-muted-foreground/80">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4 pb-2 px-6">
          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive font-semibold animate-in fade-in slide-in-from-top-2 duration-200">
              {error}
            </div>
          )}
          
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold text-foreground/80 tracking-wide">Email address</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className={cn("h-4.5 w-4.5 transition-colors duration-200", emailFocused ? "text-[#f0a500]" : "text-muted-foreground/50")} />
              </div>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                required
                className="bg-muted/30 dark:bg-muted/10 border-border/50 hover:border-border/80 focus:bg-background focus-visible:border-[#f0a500] focus-visible:ring-4 focus-visible:ring-[#f0a500]/10 rounded-lg pl-10.5 h-11 text-sm transition-all shadow-none"
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-semibold text-foreground/80 tracking-wide">Password</Label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className={cn("h-4.5 w-4.5 transition-colors duration-200", passwordFocused ? "text-[#f0a500]" : "text-muted-foreground/50")} />
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                required
                className="bg-muted/30 dark:bg-muted/10 border-border/50 hover:border-border/80 focus:bg-background focus-visible:border-[#f0a500] focus-visible:ring-4 focus-visible:ring-[#f0a500]/10 rounded-lg pl-10.5 pr-11 h-11 text-sm transition-all shadow-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground cursor-pointer transition-colors p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
          </div>
        </CardContent>
        <div className="flex flex-col gap-4 px-6 pb-6 pt-3">
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-[#111111] dark:bg-[#f5f1ec] text-[#ffffff] dark:text-[#111111] hover:bg-[#111111]/90 dark:hover:bg-[#f5f1ec]/90 hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-md shadow-primary/5 rounded-lg font-semibold transition-all duration-200 group flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4.5 w-4.5 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="ml-2 h-4.5 w-4.5 transition-transform group-hover:translate-x-1 duration-200" />
              </>
            )}
          </Button>
          <div className="text-center text-xs text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold text-[#f0a500] hover:text-[#d38b00] underline-offset-4 hover:underline transition-all">
              Create one now
            </Link>
          </div>
        </div>
      </form>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <div className="login-page min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row bg-[#f5f1ec] dark:bg-[#111111]">
      {/* Left visual column */}
      <div className="hidden lg:flex lg:w-5/12 bg-[#111111] text-white p-8 xl:p-12 flex-col justify-between relative overflow-hidden border-r border-border/10">
        {/* Glow effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#f0a500]/10 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-neutral-900 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none" />
        
        {/* Header */}
        <div className="relative z-10 flex items-center gap-2">
          <svg viewBox="0 0 100 100" className="h-7 w-7" fillRule="evenodd">
            <rect width="100" height="100" rx="16" fill="#f0a500" />
            <path d="M30 18h15c20 0 35 12 35 32s-15 32-35 32H30c-4.4 0-8-3.6-8-8V26c0-4.4 3.6-8 8-8zm13 14H35v36h8c11 0 19-7 19-18s-8-18-19-18z" fill="#ffffff" />
          </svg>
          <span className="font-bold tracking-[0.03em] text-white">DRIVERS <span className="text-[#f0a500]">AUSTRALIA</span></span>
        </div>

        {/* Main Feature / Mockup */}
        <div className="relative z-10 my-auto py-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#f0a500]/10 text-[#f0a500] border border-[#f0a500]/20 mb-6">
            <Sparkles className="h-3 w-3" /> Australia's Transport Network
          </span>
          <h1 className="text-3xl xl:text-4xl font-medium tracking-tight text-white leading-tight mb-8">
            The professional hub connecting logistics companies with qualified operators.
          </h1>

          {/* Product Mockup inside Left Column */}
          <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-bold text-[#f0a500] uppercase tracking-wider">Premium Listing</span>
                <h3 className="text-base font-medium text-white mt-1">MC B-Double Interstate Driver</h3>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-medium rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active</span>
            </div>
            <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
              Seeking reliable driver for regular Sydney to Melbourne express runs. Late model Kenworth fleet, competitive pay, immediate start.
            </p>
            
            <div className="border-t border-white/5 pt-4 flex justify-between items-center text-[11px] text-neutral-400">
              <div className="flex gap-2">
                <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">MC License</span>
                <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">Sydney Base</span>
              </div>
              <span className="flex items-center gap-1"><UserCheck className="h-3 w-3 text-[#f0a500]" /> 5 Applicants</span>
            </div>
          </div>
        </div>

        {/* Testimonial Footer */}
        <div className="relative z-10 border-t border-white/5 pt-6 text-xs text-neutral-400">
          <p className="italic">
            "Connecting with local operators has never been more straightforward. We filled our MC positions within a few days."
          </p>
          <p className="mt-2 text-white font-medium">— Operations Director, Brisbane Logistics</p>
        </div>
      </div>
      
      {/* Right form column */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-[#f5f1ec] dark:bg-[#111111] relative overflow-hidden">
        {/* Soft premium background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#f0a500]/5 dark:bg-[#f0a500]/2 rounded-full blur-[100px] pointer-events-none" />
        <Suspense fallback={
          <Card className="w-full max-w-md border border-border/80 bg-card p-8 flex flex-col items-center justify-center min-h-[400px] rounded-2xl shadow-xl">
            <Loader2 className="h-8 w-8 animate-spin text-[#f0a500]" />
            <p className="text-sm text-muted-foreground mt-4 font-medium">Loading secure portal...</p>
          </Card>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
