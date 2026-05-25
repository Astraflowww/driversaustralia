import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  FileSpreadsheet, 
  Coins, 
  CheckCircle, 
  Clock, 
  XCircle,
  ShieldAlert,
  ArrowRight
} from 'lucide-react'

export const revalidate = 0

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Get current user session
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch admin profile to confirm role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    redirect('/')
  }

  // Query site analytics
  const { data: profilesData } = await supabase.from('profiles').select('id, role')
  const { data: listingsData } = await supabase.from('listings').select('id, status')
  const { count: txCount = 0 } = await supabase.from('token_transactions').select('*', { count: 'exact', head: true })

  const profiles = (profilesData as any[]) || []
  const listings = (listingsData as any[]) || []

  // Calculations
  const totalUsers = profiles.length
  const totalSellers = profiles.filter(p => p.role === 'seller').length
  const totalBuyers = profiles.filter(p => p.role === 'buyer').length
  const totalAdmins = profiles.filter(p => p.role === 'admin').length

  const totalListings = listings.length
  const approvedListings = listings.filter(l => l.status === 'approved').length
  const pendingListings = listings.filter(l => l.status === 'pending').length
  const rejectedListings = listings.filter(l => l.status === 'rejected').length

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 bg-background">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b pb-4 border-border/40">
        <h1 className="text-3xl font-medium tracking-tight flex items-center gap-2 lg:tracking-[-0.8px] text-foreground">
          <ShieldAlert className="h-8 w-8 text-foreground" />
          Admin Overview Portal
        </h1>
        <p className="text-muted-foreground mt-1">
          Monitor system metrics, moderate user listings, and issue token adjustments.
        </p>
      </div>

      {/* Analytics Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Users Summary */}
        <Card className="border-border bg-card shadow-none rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              User Accounts
            </CardTitle>
            <Users className="h-5 w-5 text-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-4xl font-medium tracking-tight">{totalUsers}</div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs border-t pt-3 border-border/40">
              <div>
                <p className="font-semibold text-foreground">{totalSellers}</p>
                <p className="text-muted-foreground">Sellers</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">{totalBuyers}</p>
                <p className="text-muted-foreground">Buyers</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">{totalAdmins}</p>
                <p className="text-muted-foreground">Admins</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Listings Summary */}
        <Card className="border-border bg-card shadow-none rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              System Postings
            </CardTitle>
            <FileSpreadsheet className="h-5 w-5 text-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-4xl font-medium tracking-tight">{totalListings}</div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs border-t pt-3 border-border/40">
              <div>
                <p className="font-semibold text-[#079c37]">{approvedListings}</p>
                <p className="text-muted-foreground">Approved</p>
              </div>
              <div>
                <p className="font-semibold text-amber-600">{pendingListings}</p>
                <p className="text-muted-foreground">Pending</p>
              </div>
              <div>
                <p className="font-semibold text-destructive">{rejectedListings}</p>
                <p className="text-muted-foreground">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Summary */}
        <Card className="border-border bg-card shadow-none rounded-lg flex flex-col justify-between">
          <div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Audited Transactions
              </CardTitle>
              <Coins className="h-5 w-5 text-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-medium tracking-tight">{txCount || 0}</div>
              <p className="text-xs text-muted-foreground mt-2">
                All token exchanges and adjustments are logged for audit safety.
              </p>
            </CardContent>
          </div>
        </Card>
      </div>

      {/* Control Shortcuts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border bg-card shadow-none rounded-lg">
          <CardHeader>
            <CardTitle className="text-lg font-medium tracking-tight">Listings Moderation</CardTitle>
            <CardDescription>
              Review pending listings created by sellers. Approve postings to make them public.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              <span className="text-sm font-semibold text-amber-600">
                {pendingListings} listings require review
              </span>
            </div>
            <Link href="/admin/listings">
              <Button className="cursor-pointer gap-1.5" size="sm">
                Open Queue
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-none rounded-lg">
          <CardHeader>
            <CardTitle className="text-lg font-medium tracking-tight">Token Manager</CardTitle>
            <CardDescription>
              Grant or deduct listing credits for sellers. Oversee user accounts and balances.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Adjust credits atomically with reason logs
            </span>
            <Link href="/admin/users">
              <Button className="cursor-pointer gap-1.5" size="sm">
                Manage Users
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
