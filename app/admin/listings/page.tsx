import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ListingApprovalTable } from '@/components/admin/ListingApprovalTable'
import { ArrowLeft } from 'lucide-react'

export const revalidate = 0

export default async function AdminListingsPage() {
  const supabase = await createClient()

  // Get current user session
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch current user details to confirm admin status
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    redirect('/')
  }

  // Fetch all listings with seller profiles
  const { data: listings = [] } = await supabase
    .from('listings')
    .select(`
      id,
      title,
      description,
      category,
      status,
      created_at,
      profiles (
        full_name,
        email
      )
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Back navigation */}
      <div>
        <Link href="/admin/dashboard" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Admin Dashboard
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-2 border-b pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight">Listings Moderation Queue</h1>
        <p className="text-muted-foreground mt-1">
          Approve listings to publish them in the public feed, or reject listings that violate requirements.
        </p>
      </div>

      {/* Listings Moderation Component */}
      <ListingApprovalTable initialListings={listings as any[]} />
    </div>
  )
}
