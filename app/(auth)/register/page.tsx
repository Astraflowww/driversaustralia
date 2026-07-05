'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Sparkles, Loader2, ArrowRight, Eye, EyeOff, Lock, Mail, User, Briefcase, CheckCircle2, Check, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export default function RegisterPage() {
  const router = useRouter()
  
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Focus states for premium visual feedback
  const [nameFocused, setNameFocused] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [phoneFocused, setPhoneFocused] = useState(false)
  const [addressFocused, setAddressFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your password.')
      setLoading(false)
      return
    }

    const supabase = createClient()

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
            address: address,
            role: role,
          },
        },
      })

      if (signUpError) {
        throw signUpError
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 5000)
    } catch (err: any) {
      setError(err.message || 'Failed to register. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-page min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row bg-[#f5f1ec] dark:bg-[#111111]">
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
            <Sparkles className="h-3 w-3" /> Get Started Today
          </span>
          <h1 className="text-3xl xl:text-4xl font-medium tracking-tight text-white leading-tight mb-8">
            Create an account to list transport jobs or respond to driver openings.
          </h1>

          {/* Product Mockup inside Left Column */}
          <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-bold text-[#f0a500] uppercase tracking-wider">New Operator Profile</span>
                <h3 className="text-base font-medium text-white mt-1">AusWide Freight Pty Ltd</h3>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-medium rounded bg-[#f0a500]/10 text-[#f0a500] border border-[#f0a500]/20">3 Tokens</span>
            </div>
            <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
              Registered transport operator in New South Wales and Victoria. Posting high-frequency logistics and linehaul opportunities.
            </p>
            
            <div className="border-t border-white/5 pt-4 flex items-center justify-between text-[11px] text-neutral-400">
              <span className="text-emerald-400 font-semibold flex items-center gap-1">✓ Verified Operator</span>
              <span className="text-neutral-500">Joined June 2026</span>
            </div>
          </div>
        </div>

        {/* Testimonial Footer */}
        <div className="relative z-10 border-t border-white/5 pt-6 text-xs text-neutral-400">
          <p className="italic">
            "We registered, listed our requirements, and had three responses from verified heavy vehicle drivers the next morning."
          </p>
          <p className="mt-2 text-white font-medium">— Fleet Manager, Melbourne Transport</p>
        </div>
      </div>
      
      {/* Right form column */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-[#f5f1ec] dark:bg-[#111111] relative overflow-hidden">
        {/* Soft premium background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#f0a500]/5 dark:bg-[#f0a500]/2 rounded-full blur-[100px] pointer-events-none" />
        
        <Card className="w-full max-w-[420px] border border-border/60 bg-card shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 relative overflow-hidden group z-10">
          <CardHeader className="space-y-1.5 text-center pb-4 pt-6 px-6">
            <div className="mx-auto mb-3.5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0a500]/10 border border-[#f0a500]/20 text-[#f0a500] shadow-sm transition-transform duration-300 hover:scale-105">
              <svg viewBox="0 0 100 100" className="h-7 w-7" fillRule="evenodd">
                <rect width="100" height="100" rx="16" fill="#f0a500" />
                <path d="M30 18h15c20 0 35 12 35 32s-15 32-35 32H30c-4.4 0-8-3.6-8-8V26c0-4.4 3.6-8 8-8zm13 14H35v36h8c11 0 19-7 19-18s-8-18-19-18z" fill="#ffffff" />
              </svg>
            </div>
            <CardTitle className="text-2xl font-semibold tracking-tight text-foreground">Create your account</CardTitle>
            <CardDescription className="text-sm text-muted-foreground/80">
              Enter your details to create an account
            </CardDescription>
          </CardHeader>
          
          {success ? (
            <CardContent className="space-y-4 py-8 text-center animate-in zoom-in duration-300 px-6">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4 text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
                Registration successful!
              </div>
              <p className="text-muted-foreground text-sm">
                We have sent an email verification link to <span className="font-semibold text-foreground">{email}</span>. Please verify your email before logging in.
              </p>
              <p className="text-muted-foreground/60 text-xs">
                Redirecting you to the login page...
              </p>
            </CardContent>
          ) : (
            <form onSubmit={handleRegister}>
              <CardContent className="space-y-4 pb-2 px-6">
                {error && (
                  <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive font-semibold animate-in fade-in slide-in-from-top-2 duration-200">
                    {error}
                  </div>
                )}
                
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-xs font-semibold text-foreground/80 tracking-wide">Full Name</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User className={cn("h-4.5 w-4.5 transition-colors duration-200", nameFocused ? "text-[#f0a500]" : "text-muted-foreground/70")} />
                    </div>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      onFocus={() => setNameFocused(true)}
                      onBlur={() => setNameFocused(false)}
                      required
                      className="bg-muted/30 dark:bg-muted/10 border-border/50 hover:border-border/80 focus:bg-background focus-visible:border-[#f0a500] focus-visible:ring-4 focus-visible:ring-[#f0a500]/10 rounded-lg pl-10.5 h-11 text-sm transition-all shadow-none"
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold text-foreground/80 tracking-wide">Email address</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className={cn("h-4.5 w-4.5 transition-colors duration-200", emailFocused ? "text-[#f0a500]" : "text-muted-foreground/70")} />
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
                  <Label htmlFor="phone" className="text-xs font-semibold text-foreground/80 tracking-wide">Mobile Number</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Phone className={cn("h-4.5 w-4.5 transition-colors duration-200", phoneFocused ? "text-[#f0a500]" : "text-muted-foreground/70")} />
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+61 400 000 000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onFocus={() => setPhoneFocused(true)}
                      onBlur={() => setPhoneFocused(false)}
                      required
                      className="bg-muted/30 dark:bg-muted/10 border-border/50 hover:border-border/80 focus:bg-background focus-visible:border-[#f0a500] focus-visible:ring-4 focus-visible:ring-[#f0a500]/10 rounded-lg pl-10.5 h-11 text-sm transition-all shadow-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="address" className="text-xs font-semibold text-foreground/80 tracking-wide">Address</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <MapPin className={cn("h-4.5 w-4.5 transition-colors duration-200", addressFocused ? "text-[#f0a500]" : "text-muted-foreground/70")} />
                    </div>
                    <Input
                      id="address"
                      type="text"
                      placeholder="Street Address, City, State, Postcode"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      onFocus={() => setAddressFocused(true)}
                      onBlur={() => setAddressFocused(false)}
                      required
                      className="bg-muted/30 dark:bg-muted/10 border-border/50 hover:border-border/80 focus:bg-background focus-visible:border-[#f0a500] focus-visible:ring-4 focus-visible:ring-[#f0a500]/10 rounded-lg pl-10.5 h-11 text-sm transition-all shadow-none"
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs font-semibold text-foreground/80 tracking-wide">Password</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className={cn("h-4.5 w-4.5 transition-colors duration-200", passwordFocused ? "text-[#f0a500]" : "text-muted-foreground/70")} />
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

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-xs font-semibold text-foreground/80 tracking-wide">Confirm Password</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className={cn("h-4.5 w-4.5 transition-colors duration-200", confirmPasswordFocused ? "text-[#f0a500]" : "text-muted-foreground/70")} />
                    </div>
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onFocus={() => setConfirmPasswordFocused(true)}
                      onBlur={() => setConfirmPasswordFocused(false)}
                      required
                      className="bg-muted/30 dark:bg-muted/10 border-border/50 hover:border-border/80 focus:bg-background focus-visible:border-[#f0a500] focus-visible:ring-4 focus-visible:ring-[#f0a500]/10 rounded-lg pl-10.5 pr-11 h-11 text-sm transition-all shadow-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground cursor-pointer transition-colors p-1"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2.5">
                  <Label className="text-xs font-semibold text-foreground/80 tracking-wide">Account Type</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('buyer')}
                      className={`group/btn flex flex-col items-start p-4 rounded-lg border text-left transition-all duration-300 cursor-pointer relative overflow-hidden ${
                        role === 'buyer'
                          ? 'border-[#f0a500] bg-[#f0a500]/5 ring-2 ring-[#f0a500]/20'
                          : 'border-border bg-background/50 hover:bg-muted/65 hover:border-foreground/20 hover:scale-[1.01]'
                      }`}
                    >
                      {role === 'buyer' && (
                        <div className="absolute top-2.5 right-2.5 rounded-full bg-[#f0a500]/10 p-0.5 text-[#f0a500]">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                      <div className={`p-1.5 rounded-lg mb-2.5 transition-colors duration-300 ${role === 'buyer' ? 'bg-[#f0a500]/15 text-[#f0a500]' : 'bg-muted text-muted-foreground/85 group-hover/btn:bg-foreground/5 group-hover/btn:text-foreground'}`}>
                        <User className="h-4.5 w-4.5" />
                      </div>
                      <span className="font-semibold text-sm text-foreground">Driver</span>
                      <span className="text-[10px] text-muted-foreground/90 mt-1.5 leading-snug">
                        Browse and respond to active driver openings.
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('seller')}
                      className={`group/btn flex flex-col items-start p-4 rounded-lg border text-left transition-all duration-300 cursor-pointer relative overflow-hidden ${
                        role === 'seller'
                          ? 'border-[#f0a500] bg-[#f0a500]/5 ring-2 ring-[#f0a500]/20'
                          : 'border-border bg-background/50 hover:bg-muted/65 hover:border-foreground/20 hover:scale-[1.01]'
                      }`}
                    >
                      {role === 'seller' && (
                        <div className="absolute top-2.5 right-2.5 rounded-full bg-[#f0a500]/10 p-0.5 text-[#f0a500]">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                      <div className={`p-1.5 rounded-lg mb-2.5 transition-colors duration-300 ${role === 'seller' ? 'bg-[#f0a500]/15 text-[#f0a500]' : 'bg-muted text-muted-foreground/85 group-hover/btn:bg-foreground/5 group-hover/btn:text-foreground'}`}>
                        <Briefcase className="h-4.5 w-4.5" />
                      </div>
                      <span className="font-semibold text-sm text-foreground">Business Owner</span>
                      <span className="text-[10px] text-muted-foreground/90 mt-1.5 leading-snug">
                        Post driver job listings.
                      </span>
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
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-4.5 w-4.5 transition-transform group-hover:translate-x-1 duration-200" />
                    </>
                  )}
                </Button>
                <div className="text-center text-xs text-muted-foreground">
                  Already have an account?{' '}
                  <Link href="/login" className="font-semibold text-[#f0a500] hover:text-[#d38b00] underline-offset-4 hover:underline transition-all">
                    Sign In
                  </Link>
                </div>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  )
}
