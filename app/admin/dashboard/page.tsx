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
  Shield,
  ArrowRight,
  UserCheck,
  PlusCircle,
  Settings,
  History,
  AlertCircle
} from 'lucide-react'
import { TokenBadge } from '@/components/shared/TokenBadge'

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
    .select('role, full_name, email')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    redirect('/')
  }

  // 1. Fetch site statistics
  const { data: profilesData = [] } = await supabase.from('profiles').select('id, role, full_name, email, tokens, created_at')
  const { data: listingsData = [] } = await supabase.from('listings').select('id, title, status, category, created_at, seller_id')
  
  // 2. Fetch recent transactions
  const { data: txsData = [] } = await supabase
    .from('token_transactions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  // Resolve user/admin details for recent transactions in-memory to prevent complex ambiguity join errors
  const userIds = Array.from(new Set([
    ...(txsData || []).map((t: any) => t.user_id),
    ...(txsData || []).map((t: any) => t.admin_id).filter(Boolean)
  ]))
  
  const { data: txProfiles = [] } = userIds.length > 0 
    ? await supabase.from('profiles').select('id, email, full_name').in('id', userIds)
    : { data: [] }

  const profileMap = new Map((txProfiles || []).map((p: any) => [p.id, p]))

  const transactions = (txsData || []).map((t: any) => ({
    ...t,
    user: profileMap.get(t.user_id),
    admin: t.admin_id ? profileMap.get(t.admin_id) : null
  }))

  // 3. Fetch recent pending listings
  const { data: pendingQueue = [] } = await supabase
    .from('listings')
    .select(`
      id,
      title,
      category,
      created_at,
      profiles (
        full_name,
        email,
        business_name
      )
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(5)

  // Calculations
  const totalUsers = (profilesData || []).length
  const totalSellers = (profilesData || []).filter((p: any) => p.role === 'seller').length
  const totalBuyers = (profilesData || []).filter((p: any) => p.role === 'buyer').length
  const totalAdmins = (profilesData || []).filter((p: any) => p.role === 'admin').length

  const totalListings = (listingsData || []).length
  const approvedListings = (listingsData || []).filter((l: any) => l.status === 'approved').length
  const pendingListings = (listingsData || []).filter((l: any) => l.status === 'pending').length
  const rejectedListings = (listingsData || []).filter((l: any) => l.status === 'rejected').length

  return (
    <div className="space-y-8">
      {/* Welcome Banner - WordPress style dashboard welcome widget */}
      <div className="rounded-xl border border-[#d3cec6] bg-white p-6 md:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none transform translate-y-1/4 translate-x-1/4">
          <Shield className="h-96 w-96 text-[#111111]" />
        </div>
        <div className="max-w-3xl space-y-4">
          <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-[#111111]">
            Welcome to the Drivers Australia Administration Dashboard
          </h1>
          <p className="text-sm text-[#626260] leading-relaxed">
            This administration portal gives you direct control over listing submissions, user accounts, posting credits, and global website behavior. Utilize the quick links below to perform routine tasks.
          </p>
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Link href="/admin/listings">
              <Button size="sm" className="w-full justify-start cursor-pointer font-semibold bg-[#111111] hover:bg-[#111111]/90 text-white">
                <Clock className="mr-2 h-4 w-4 text-[#f0a500]" />
                Moderate Listings ({pendingListings})
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button size="sm" variant="outline" className="w-full justify-start cursor-pointer font-semibold border-[#d3cec6] bg-white hover:bg-neutral-50 text-[#111111]">
                <Users className="mr-2 h-4 w-4 text-[#f0a500]" />
                Manage User Tokens
              </Button>
            </Link>
            <Link href="/admin/settings">
              <Button size="sm" variant="outline" className="w-full justify-start cursor-pointer font-semibold border-[#d3cec6] bg-white hover:bg-neutral-50 text-[#111111]">
                <Settings className="mr-2 h-4 w-4 text-[#f0a500]" />
                Configure System Settings
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Analytics Counter Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Users Card */}
        <Card className="border-[#d3cec6] bg-white shadow-sm rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-[#f5f1ec]">
            <CardTitle className="text-[11px] font-bold text-[#626260] uppercase tracking-wider">
              User Accounts
            </CardTitle>
            <Users className="h-4.5 w-4.5 text-[#f0a500]" />
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="text-3xl font-medium tracking-tight text-[#111111]">{totalUsers}</div>
            <div className="grid grid-cols-3 gap-2 text-center text-[11px] border-t border-[#f5f1ec] pt-3">
              <div>
                <p className="font-bold text-[#111111]">{totalSellers}</p>
                <p className="text-[#626260] scale-95 origin-center">Sellers</p>
              </div>
              <div>
                <p className="font-bold text-[#111111]">{totalBuyers}</p>
                <p className="text-[#626260] scale-95 origin-center">Drivers</p>
              </div>
              <div>
                <p className="font-bold text-[#111111]">{totalAdmins}</p>
                <p className="text-[#626260] scale-95 origin-center">Admins</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Listings Card */}
        <Card className="border-[#d3cec6] bg-white shadow-sm rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-[#f5f1ec]">
            <CardTitle className="text-[11px] font-bold text-[#626260] uppercase tracking-wider">
              Listings Directory
            </CardTitle>
            <FileSpreadsheet className="h-4.5 w-4.5 text-[#f0a500]" />
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="text-3xl font-medium tracking-tight text-[#111111]">{totalListings}</div>
            <div className="grid grid-cols-3 gap-2 text-center text-[11px] border-t border-[#f5f1ec] pt-3">
              <div>
                <p className="font-bold text-[#079c37]">{approvedListings}</p>
                <p className="text-[#626260] scale-95 origin-center">Approved</p>
              </div>
              <div>
                <p className="font-bold text-amber-600">{pendingListings}</p>
                <p className="text-[#626260] scale-95 origin-center">Pending</p>
              </div>
              <div>
                <p className="font-bold text-[#c41c1c]">{rejectedListings}</p>
                <p className="text-[#626260] scale-95 origin-center">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audit Transactions Card */}
        <Card className="border-[#d3cec6] bg-white shadow-sm rounded-xl flex flex-col justify-between">
          <div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-[#f5f1ec]">
              <CardTitle className="text-[11px] font-bold text-[#626260] uppercase tracking-wider">
                Audited Token Logs
              </CardTitle>
              <Coins className="h-4.5 w-4.5 text-[#f0a500]" />
            </CardHeader>
            <CardContent className="pt-4 space-y-2">
              <div className="text-3xl font-medium tracking-tight text-[#111111]">
                {(profilesData || []).reduce((acc: number, p: any) => acc + (p.tokens || 0), 0)}
              </div>
              <p className="text-xs text-[#626260]">
                Total seller credits active in the system ecosystem. Check ledger for audit tracking.
              </p>
            </CardContent>
          </div>
        </Card>
      </div>

      {/* Main Admin Dashboard Widgets Split */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* At a Glance & Quick Actions */}
        <div className="space-y-6">
          {/* At a Glance Widget */}
          <Card className="border-[#d3cec6] bg-white shadow-sm rounded-xl">
            <CardHeader className="border-b border-[#f5f1ec]">
              <CardTitle className="text-base font-medium text-[#111111]">At a Glance</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-neutral-100 flex items-center justify-center">
                    <FileSpreadsheet className="h-4 w-4 text-neutral-500" />
                  </div>
                  <div>
                    <Link href="/admin/listings" className="font-semibold text-[#111111] hover:underline">
                      {totalListings} Listings
                    </Link>
                    <p className="text-xs text-[#626260]">{pendingListings} pending moderation</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-neutral-100 flex items-center justify-center">
                    <Users className="h-4 w-4 text-neutral-500" />
                  </div>
                  <div>
                    <Link href="/admin/users" className="font-semibold text-[#111111] hover:underline">
                      {totalUsers} Registered Users
                    </Link>
                    <p className="text-xs text-[#626260]">{totalSellers} sellers, {totalBuyers} drivers</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#f5f1ec] pt-3 text-xs text-[#626260] flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 text-[#f0a500]" />
                <span>Default configuration gives sellers 5 credits on registration.</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick User Balance Lookup */}
          <Card className="border-[#d3cec6] bg-white shadow-sm rounded-xl">
            <CardHeader className="border-b border-[#f5f1ec]">
              <CardTitle className="text-base font-medium text-[#111111]">Quick User Credits Adjuster</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <form action="/admin/users" method="GET" className="space-y-4">
                <div className="space-y-1.5">
                  <p className="text-xs text-[#626260] leading-relaxed">
                    Search by username, full name, or email address to instantly load their token details and apply manual adjustments.
                  </p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      name="search" 
                      placeholder="e.g. seller@example.com" 
                      className="flex-grow text-sm rounded-lg border border-[#d3cec6] bg-white px-3.5 py-2 text-[#111111] focus:outline-none focus:ring-1 focus:ring-[#f0a500] placeholder-[#9c9fa5]"
                      required
                    />
                    <Button type="submit" size="sm" className="cursor-pointer bg-[#111111] hover:bg-[#111111]/90 text-white font-semibold">
                      Lookup User
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Listings Moderation Queue Widget */}
        <div className="space-y-6">
          <Card className="border-[#d3cec6] bg-white shadow-sm rounded-xl">
            <CardHeader className="border-b border-[#f5f1ec] flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-base font-medium text-[#111111]">Recent Submissions</CardTitle>
                <CardDescription className="text-xs mt-0.5">Pending approval queue</CardDescription>
              </div>
              <Link href="/admin/listings">
                <Button variant="ghost" size="sm" className="text-xs text-[#f0a500] hover:text-[#f0a500]/80 gap-1 font-semibold cursor-pointer">
                  View All
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="pt-2 px-0 pb-0">
              {pendingQueue.length === 0 ? (
                <div className="p-6 text-center text-sm text-[#626260]">
                  <CheckCircle className="h-8 w-8 text-[#079c37] mx-auto mb-2 opacity-80" />
                  Listing queue is clear! All submissions approved.
                </div>
              ) : (
                <div className="divide-y divide-[#f5f1ec]">
                  {(pendingQueue || []).map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors">
                      <div className="space-y-1 max-w-[70%]">
                        <span className="inline-block text-[10px] uppercase font-bold tracking-wider text-[#626260] bg-neutral-100 px-1.5 py-0.5 rounded">
                          {item.category}
                        </span>
                        <h4 className="font-bold text-sm text-[#111111] truncate">{item.title}</h4>
                        <p className="text-[11px] text-[#626260] truncate">
                          by {item.profiles?.business_name || item.profiles?.full_name || item.profiles?.email}
                        </p>
                      </div>
                      <Link href="/admin/listings">
                        <Button size="sm" variant="outline" className="border-[#d3cec6] text-xs h-8 cursor-pointer font-semibold">
                          Moderate
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity: Token Auditing Log */}
      <Card className="border-[#d3cec6] bg-white shadow-sm rounded-xl">
        <CardHeader className="border-b border-[#f5f1ec] flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-base font-medium text-[#111111]">Recent Token Transactions</CardTitle>
            <CardDescription className="text-xs mt-0.5">Latest balance audits</CardDescription>
          </div>
          <Link href="/admin/transactions">
            <Button variant="ghost" size="sm" className="text-xs text-[#f0a500] hover:text-[#f0a500]/80 gap-1 font-semibold cursor-pointer">
              Full Ledger
              <History className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="pt-2 px-0 pb-0">
          {transactions.length === 0 ? (
            <div className="p-6 text-center text-sm text-[#626260]">
              No transactions recorded in the logs yet.
            </div>
          ) : (
            <div className="divide-y divide-[#f5f1ec] text-sm">
              {(transactions || []).map((tx: any) => (
                <div key={tx.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-neutral-50 transition-colors gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-[#111111]">
                        {tx.user?.full_name || tx.user?.email || 'Unknown User'}
                      </span>
                      <span className="text-xs text-[#626260] shrink-0">
                        ({tx.user?.email})
                      </span>
                    </div>
                    <p className="text-xs text-[#626260]">
                      Reason: <span className="italic text-[#111111]">"{tx.reason || 'Not specified'}"</span>
                    </p>
                    {tx.admin && (
                      <p className="text-[10px] text-neutral-400">
                        Adjusted by Admin: {tx.admin.full_name || tx.admin.email}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    <span className="text-[11px] text-[#626260] hidden md:inline">
                      {new Date(tx.created_at).toLocaleString()}
                    </span>
                    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-bold ${
                      tx.delta > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {tx.delta > 0 ? `+${tx.delta}` : tx.delta} tokens
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
