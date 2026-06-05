import React from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ListingForm } from '@/components/listings/ListingForm'
import { BusinessProfileForm } from '@/components/listings/BusinessProfileForm'
import { TokenBadge } from '@/components/shared/TokenBadge'
import { AlertCircle, Building2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export const revalidate = 0

export default async function NewListingPage() {
  const supabase = await createClient()

  // Get current user session
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load profile. Please contact support.
        </div>
      </div>
    )
  }

  const hasTokens = profile.tokens > 0
  const hasBusinessDetails = !!(
    profile.business_name &&
    profile.business_phone &&
    profile.abn &&
    profile.business_address
  )

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Page Title */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Job Listing</h1>
          <p className="text-muted-foreground mt-1">
            Design custom screening questionnaires to capture licence validation and driving history.
          </p>
        </div>
        <div>
          <TokenBadge tokens={profile.tokens} className="text-sm py-1.5 px-3" />
        </div>
      </div>

      {!hasBusinessDetails ? (
        <div className="space-y-6">
          <Card className="border-amber-500/30 bg-amber-500/5 text-amber-800 animate-in fade-in duration-200">
            <CardContent className="flex items-start gap-3 p-4">
              <Building2 className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1 text-sm">
                <h4 className="font-bold">Company Profile Details Required</h4>
                <p className="text-amber-800/80">
                  Register your company information and ABN to start publishing driver job boards and custom pre-screening forms.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <BusinessProfileForm initialProfile={profile} />
        </div>
      ) : (
        <>
          {!hasTokens && (
            <Card className="border-destructive/30 bg-destructive/5 text-destructive animate-in fade-in duration-200">
              <CardContent className="flex items-start gap-3 p-4">
                <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div className="space-y-1 text-sm">
                  <h4 className="font-bold">No Credits Remaining</h4>
                  <p className="text-destructive/80">
                    You have 0 active tokens. Creating a job listing requires 1 token credit. Contact support to request additional credits.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Form Builder Component */}
          <ListingForm initialTokens={profile.tokens} userId={user.id} />
        </>
      )}
    </div>
  )
}
