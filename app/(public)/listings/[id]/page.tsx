import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BuyerResponseForm } from '@/components/listings/BuyerResponseForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Calendar, Briefcase, User, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StartChatButton } from '@/components/messaging/StartChatButton'

export const revalidate = 0

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch listing details + seller profiles
  const { data: listing } = await supabase
    .from('listings')
    .select(`
      *,
      profiles (
        full_name,
        email,
        business_name
      )
    `)
    .eq('id', id)
    .single()

  // Check if listing exists and is approved (admins and owners can view pending too, let's keep it simple for now)
  if (!listing) {
    notFound()
  }

  // If listing is closed, return the closed screen
  if (listing.status === 'closed') {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-lg border border-border bg-card p-8 text-center max-w-md mx-auto space-y-4 shadow-none">
          <div className="rounded-md bg-muted p-3 text-muted-foreground shrink-0 border border-border w-fit mx-auto">
            <Briefcase className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-foreground">Listing Closed</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This job listing has been closed by the transport operator and is no longer accepting new responses.
          </p>
          <Link href="/" className="inline-block pt-2">
            <Button variant="outline" size="sm" className="cursor-pointer">
              Back to Browse
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Double check status. If not approved, confirm if current user is owner or admin.
  if (listing.status !== 'approved') {
    let isAuthorized = false
    if (user) {
      if (listing.seller_id === user.id) {
        isAuthorized = true
      } else {
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        
        if (userProfile?.role === 'admin') {
          isAuthorized = true
        }
      }
    }

    if (!isAuthorized) {
      return (
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-6 text-center max-w-md mx-auto space-y-3">
            <h3 className="font-bold text-amber-600 dark:text-amber-400">Listing Awaiting Moderation</h3>
            <p className="text-sm text-muted-foreground">
              This listing is currently in the review queue. Transport operators will be able to receive applications once approved.
            </p>
            <Link href="/" className="inline-block mt-2">
              <span className="text-sm font-semibold text-primary hover:underline">Back to Browse</span>
            </Link>
          </div>
        </div>
      )
    }
  }

  const sellerProfile = listing.profiles as any
  const fields = listing.form_schema as any[]

  // Category-specific badge styles using the report palette from DESIGN.md
  const categoryStyles: Record<string, string> = {
    mc: 'bg-[#65b5ff]/10 text-[#006bd6] border-[#65b5ff]/20', // report-blue
    hc: 'bg-[#0bdf50]/10 text-[#079c37] border-[#0bdf50]/20', // report-green
    hr: 'bg-[#03b2cb]/10 text-[#028194] border-[#03b2cb]/20', // report-cyan
    mr: 'bg-fin-orange/10 text-fin-orange border-fin-orange/20', // fin-orange
    lr: 'bg-[#ff2067]/10 text-[#cc0044] border-[#ff2067]/20', // report-pink
    car: 'bg-[#8b5cf6]/10 text-[#6d28d9] border-[#8b5cf6]/20', // purple
    other: 'bg-muted text-muted-foreground border-border',
  }
  const badgeStyle = categoryStyles[listing.category] || categoryStyles.other

  const categoryLabels: Record<string, string> = {
    mc: 'MC Licence Required',
    hc: 'HC Licence Required',
    hr: 'HR Licence Required',
    mr: 'MR Licence Required',
    lr: 'LR Licence Required',
    car: 'Car Licence (C)',
    other: 'Specialized Licence',
  }
  const categoryLabel = categoryLabels[listing.category] || (listing.category.toUpperCase() + ' Licence')

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Back button */}
      <div>
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Listings
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Side: Listing Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${badgeStyle}`}>
                {categoryLabel}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                Posted on {new Date(listing.created_at).toLocaleDateString()}
              </span>
            </div>
            
            <h1 className="text-3xl font-medium tracking-tight sm:text-4xl text-foreground lg:tracking-[-0.8px]">
              {listing.title}
            </h1>

            {listing.status === 'pending' && (
              <div className="inline-flex items-center rounded-md bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-bold text-amber-600">
                ⚠️ Pending Moderation Approval
              </div>
            )}
          </div>

          <div className="border-t border-border/40 pt-6">
            <h3 className="text-lg font-medium mb-4 text-foreground tracking-tight">Position Overview & Licence Requirements</h3>
            <div className="prose max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed text-sm md:text-base">
              {listing.description || 'No details provided.'}
            </div>
          </div>

          {/* Seller profile card */}
          <div className="border-t border-border/40 pt-6">
            <Card className="border-border bg-card shadow-none">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="rounded-md bg-muted p-3 text-foreground shrink-0 border border-border">
                  <User className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Transport Operator</p>
                  <p className="font-semibold text-foreground text-base">
                    {sellerProfile?.business_name || sellerProfile?.full_name || 'Anonymous Operator'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Verified Operator Member
                  </p>
                </div>
              </CardContent>
              {user && user.id !== listing.seller_id && (
                <div className="px-5 pb-5 pt-1 border-t border-border/20 flex justify-end">
                  <StartChatButton
                    listingId={listing.id}
                    otherUserId={listing.seller_id}
                    label="Message Operator"
                    variant="outline"
                    className="w-full sm:w-auto"
                  />
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Right Side: Dynamic Form Submission Card */}
        <div className="lg:col-span-5">
          <Card className="border-border bg-card shadow-none rounded-lg sticky top-24">
            <CardHeader className="bg-muted/30 border-b pb-4">
              <CardTitle className="text-lg font-medium tracking-tight text-foreground flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-fin-orange" />
                Submit Candidate Response
              </CardTitle>
              <CardDescription>
                Complete the operator&apos;s verification questionnaire to send your response directly.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <BuyerResponseForm listingId={listing.id} fields={fields} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
