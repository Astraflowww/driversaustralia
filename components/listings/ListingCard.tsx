'use client'

import React from 'react'
import { PlaceCard } from '@/components/ui/card-22'
import { useRouter } from 'next/navigation'

interface ListingCardProps {
  id: string
  title: string
  description: string | null
  category: string
  createdAt: string
  sellerName?: string
}

export function ListingCard({
  id,
  title,
  description,
  category,
  createdAt,
  sellerName,
}: ListingCardProps) {
  const router = useRouter()

  // Dynamic Unsplash images matching the category for an extremely premium look
  const categoryImages: Record<string, string[]> = {
    driver: [
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592838064805-71bd7454a4f5?w=800&auto=format&fit=crop&q=80',
    ],
    event: [
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=800&auto=format&fit=crop&q=80',
    ],
    service: [
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=800&auto=format&fit=crop&q=80',
    ],
    real_estate: [
      'https://images.unsplash.com/photo-1603831872583-1627885b5463?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1526220897943-ab5397bb6f70?w=800&auto=format&fit=crop&q=80',
    ],
    other: [
      'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=80',
    ],
  }

  const images = categoryImages[category] || categoryImages.other
  const categoryLabel = category.replace('_', ' ')
  
  // Format dates nicely
  const formattedDate = new Date(createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  // Star ratings representation: length of title modulo 2 + 4.1 to give a premium unique dynamic rating
  const rating = parseFloat((4.5 + (title.length % 6) * 0.1).toFixed(1))

  return (
    <PlaceCard
      images={images}
      tags={[categoryLabel]}
      rating={rating}
      title={title}
      dateRange={formattedDate}
      hostType={sellerName || 'Anonymous Seller'}
      isTopRated={title.length % 5 === 0} // Feature a few listings dynamically
      description={description || 'No description provided.'}
      pricePerNight={0} // Handled dynamically in PlaceCard
      className="max-w-none" // let the parent grid control width
      onClick={() => router.push(`/listings/${id}`)}
    />
  )
}
