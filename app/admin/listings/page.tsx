import React from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ListingApprovalTable } from '@/components/admin/ListingApprovalTable'

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
    .select('role')
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
        email,
        business_name
      )
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#d3cec6] pb-4">
        <h1 className="text-2xl font-medium tracking-tight text-[#111111]">Listings Queue</h1>
        <p className="text-xs text-[#626260] mt-1">
          Approve listings to publish them in the public feed, or reject listings that violate requirements.
        </p>
      </div>

      {/* Listings Moderation Table Component */}
      <div className="rounded-xl border border-[#d3cec6] bg-white p-6 shadow-sm">
        <ListingApprovalTable initialListings={listings as any[]} />
      </div>
    </div>
  )
}
