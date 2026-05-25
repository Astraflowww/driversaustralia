import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { ListingGrid } from '@/components/listings/ListingGrid'
import BrowseClientPage from './BrowseClientPage'

export const revalidate = 0 // Dynamic page

export default async function BrowsePage() {
  const supabase = await createClient()

  // Fetch approved listings with seller names
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
