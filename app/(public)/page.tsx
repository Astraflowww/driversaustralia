import React from 'react'
import { createClient } from '@/lib/supabase/server'
import BrowseClientPage from './BrowseClientPage'
import LandingPage from '@/components/landing/LandingPage'

export const revalidate = 0 // Dynamic page

export default async function BrowsePage() {
  const supabase = await createClient()

  // Retrieve authenticated user
  const { data: { user } } = await supabase.auth.getUser()

  // If user is not logged in, render the CRO landing page
  if (!user) {
    return <LandingPage />
  }

  // If logged in, fetch approved listings for the webapp
  const { data: listingsData } = await supabase
    .from('listings')
    .select(`
      id,
      title,
      description,
      category,
      created_at,
      profiles (
        full_name
      )
    `)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  const listings = listingsData || []

  return <BrowseClientPage initialListings={listings as any[]} />
}
