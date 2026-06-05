import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TokenBadge } from '@/components/shared/TokenBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BusinessProfileCard } from '@/components/listings/BusinessProfileCard'
import { 
  PlusCircle, 
  ListTodo, 
  CheckCircle2, 
  Clock, 
  XCircle,
  FileSpreadsheet,
  Coins,
  History,
  Building2
} from 'lucide-react'

export const revalidate = 0 // Disable cache for dashboard

export default async function SellerDashboardPage() {
  const supabase = await createClient()

  // Get current user session
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch seller profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load profile. Please contact support.
        </div>
      </div>
    )
  }

  // Fetch listings
  const { data: listingsData } = await supabase
    .from('listings')
    .select('*')
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false })

  const listings = (listingsData as any[]) || []

  // Fetch transactions
  const { data: transactionsData } = await supabase
    .from('token_transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  const transactions = (transactionsData as any[]) || []

  // Calculate statistics
  const totalListings = listings?.length || 0
  const approvedListings = listings?.filter(l => l.status === 'approved').length || 0
  const pendingListings = listings?.filter(l => l.status === 'pending').length || 0
  const rejectedListings = listings?.filter(l => l.status === 'rejected').length || 0

  const hasBusinessDetails = !!(
    profile.business_name &&
    profile.business_phone &&
    profile.abn &&
    profile.business_address
  )

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 bg-background">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4 border-border/40">
        <div>
          <h1 className="text-3xl font-medium tracking-tight lg:tracking-[-0.8px] text-foreground">Transport Operator Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage active listings, track candidate applications, and monitor token transactions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <TokenBadge tokens={profile.tokens} className="text-sm py-1.5 px-3" />
          <Link href="/seller/listings/new">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-none gap-2">
              <PlusCircle className="h-4 w-4" />
              Create Listing
            </Button>
          </Link>
        </div>
      </div>

      {!hasBusinessDetails && (
        <Card className="border-amber-500/30 bg-amber-500/5 text-amber-800 animate-in fade-in duration-200">
          <CardContent className="flex items-start gap-3 p-4">
            <Building2 className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-sm">
              <h4 className="font-bold">Operator Business Profile Setup Required</h4>
              <p className="text-amber-800/80">
                Provide your company and ABN details to build custom questionnaires and publish driver listings. Configure your profile in the sidebar below.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Section */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card shadow-none rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Driver Jobs</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-medium tracking-tight">{totalListings}</div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-none rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active (Approved)</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-[#079c37]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-medium tracking-tight text-[#079c37]">{approvedListings}</div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-none rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-medium tracking-tight text-amber-600">{pendingListings}</div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-none rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-medium tracking-tight text-destructive">{rejectedListings}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Listings Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b pb-3 border-border/40">
            <h2 className="text-xl font-medium tracking-tight flex items-center gap-2 text-foreground">
              <FileSpreadsheet className="h-5 w-5 text-foreground" />
              Your Listings
            </h2>
          </div>

          {listings.length === 0 ? (
            <Card className="border-dashed border-2 flex flex-col items-center justify-center p-12 text-center border-border/65">
              <ListTodo className="h-10 w-10 text-muted-foreground/60 mb-4" />
              <CardTitle className="text-lg font-medium">No Active Listings</CardTitle>
              <CardDescription className="mt-1 mb-6">
                Create customized pre-screening forms and reach licensed drivers across Australia.
              </CardDescription>
              <Link href="/seller/listings/new">
                <Button className="cursor-pointer">Launch New Listing (-1 Token)</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid gap-4">
              {listings.map((listing) => (
                <Card key={listing.id} className="border-border bg-card hover:border-foreground/30 transition-all duration-200 shadow-none rounded-lg overflow-hidden group">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                          {listing.title}
                        </h3>
                        <span className="inline-flex items-center rounded-md bg-secondary border border-border/45 px-2 py-0.5 text-xs font-semibold text-secondary-foreground capitalize">
                          {listing.category}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 max-w-xl">
                        {listing.description || 'No description provided.'}
                      </p>
                      <span className="text-[10px] text-muted-foreground block">
                        Created on {new Date(listing.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 self-stretch sm:self-auto justify-between border-t sm:border-t-0 pt-4 sm:pt-0 border-border/40">
                      {/* Status Badges */}
                      <div>
                        {listing.status === 'approved' && (
                          <span className="inline-flex items-center rounded-md bg-green-500/10 border border-green-500/20 px-2.5 py-0.5 text-xs font-semibold text-green-600">
                            Approved
                          </span>
                        )}
                        {listing.status === 'pending' && (
                          <span className="inline-flex items-center rounded-md bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-xs font-semibold text-amber-600">
                            Pending
                          </span>
                        )}
                        {listing.status === 'rejected' && (
                          <span className="inline-flex items-center rounded-md bg-destructive/10 border border-destructive/20 px-2.5 py-0.5 text-xs font-semibold text-destructive">
                            Rejected
                          </span>
                        )}
                      </div>

                      {/* Link to view responses */}
                      <Link href={`/seller/listings/${listing.id}/responses`}>
                        <Button variant="outline" size="sm" className="cursor-pointer">
                          Responses
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <BusinessProfileCard profile={profile} />

          <div className="space-y-4">
            <h2 className="text-xl font-medium tracking-tight flex items-center gap-2 border-b pb-3 border-border/40 text-foreground">
              <History className="h-5 w-5 text-foreground" />
              Token History
            </h2>

            <Card className="border-border bg-card shadow-none rounded-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recent Transactions</CardTitle>
                <CardDescription>Audit logs for posting and token credits.</CardDescription>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    No token transactions recorded yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((tx) => {
                      const isPositive = tx.delta > 0
                      return (
                        <div key={tx.id} className="flex items-start justify-between gap-3 text-sm">
                          <div className="space-y-0.5">
                            <p className="font-medium leading-none">{tx.reason || 'Token adjustment'}</p>
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(tx.created_at).toLocaleString()}
                            </span>
                          </div>
                          <div className={`font-bold tabular-nums whitespace-nowrap ${isPositive ? 'text-green-600' : 'text-destructive'}`}>
                            {isPositive ? `+${tx.delta}` : tx.delta}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
