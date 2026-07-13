'use client'

import React from 'react'
import { ListingCard } from './ListingCard'
import { Inbox } from 'lucide-react'

interface Listing {
  id: string
  title: string
  description: string | null
  category: string
  created_at: string
  image_url?: string | null
  profiles?: {
    full_name: string | null
    business_name: string | null
  }
}

interface ListingGridProps {
  listings: Listing[]
}

export function ListingGrid({ listings }: ListingGridProps) {
  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-border bg-background/30 backdrop-blur-md">
        <Inbox className="h-10 w-10 text-muted-foreground/60 mb-3" />
        <h3 className="text-lg font-medium">No listings found</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          There are no active approved listings matching your filters right now. Check back later!
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-3 grid-cols-2 md:gap-6 lg:grid-cols-3">
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          id={listing.id}
          title={listing.title}
          description={listing.description}
          category={listing.category}
          createdAt={listing.created_at}
          imageUrl={listing.image_url}
          sellerName={listing.profiles?.business_name || listing.profiles?.full_name || undefined}
        />
      ))}
    </div>
  )
}
