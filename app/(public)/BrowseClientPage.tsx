'use client'

import React, { useState, useMemo } from 'react'
import { ListingGrid } from '@/components/listings/ListingGrid'
import { Input } from '@/components/ui/input'
import { Search, Sparkles, SlidersHorizontal, Car, Layers, Truck } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Listing {
  id: string
  title: string
  description: string | null
  category: string
  created_at: string
  profiles?: {
    full_name: string | null
  }
}

interface BrowseClientPageProps {
  initialListings: Listing[]
}

const CATEGORIES = [
  { id: 'all', label: 'All Licences', icon: Layers },
  { id: 'mc', label: 'Multi Combination (MC)', icon: Truck },
  { id: 'hc', label: 'Heavy Combination (HC)', icon: Truck },
  { id: 'hr', label: 'Heavy Rigid (HR)', icon: Truck },
  { id: 'mr', label: 'Medium Rigid (MR)', icon: Truck },
  { id: 'lr', label: 'Light Rigid (LR)', icon: Truck },
  { id: 'car', label: 'Car Licence (C)', icon: Car },
  { id: 'other', label: 'Other Licences', icon: Sparkles },
]

export default function BrowseClientPage({ initialListings }: BrowseClientPageProps) {
  const listings = initialListings || []
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Filter listings based on category selection & search input
  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      const matchesCategory =
        selectedCategory === 'all' || listing.category === selectedCategory

      const matchesSearch =
        listing.title.toLowerCase().includes(search.toLowerCase()) ||
        (listing.description?.toLowerCase() || '').includes(search.toLowerCase())

      return matchesCategory && matchesSearch
    })
  }, [listings, selectedCategory, search])

  // Count listings per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: listings.length }
    listings.forEach((listing) => {
      counts[listing.category] = (counts[listing.category] || 0) + 1
    })
    return counts
  }, [listings])

  return (
    <div className="w-full space-y-12 pb-16">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-border/20 bg-surface-2/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-fin-orange/10 border border-fin-orange/20 px-3.5 py-1 text-xs font-medium text-fin-orange">
            <Sparkles className="h-3.5 w-3.5" />
            Explore Active Driver Openings
          </span>

          <h1 className="text-4xl font-medium tracking-tight sm:text-6xl max-w-4xl mx-auto leading-tight text-foreground lg:tracking-[-1.4px]">
            Connecting Talented Drivers with{' '}
            <span className="text-fin-orange">
              Transport Opportunities
            </span>
          </h1>

          {/* Search bar wrapper */}
          <div className="max-w-xl mx-auto relative pt-4">
            <div className="relative flex items-center bg-card rounded-md border border-border px-3 py-1 shadow-none transition-shadow focus-within:border-foreground">
              <Search className="h-5 w-5 text-muted-foreground mr-2 shrink-0" />
              <Input
                type="text"
                placeholder="Search opportunities by licence class, route, or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent py-4 text-sm md:text-base w-full shadow-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main browse feed & filter section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Categories Sidebar Filter */}
          <div className="lg:col-span-3 space-y-6 min-w-0">
            <div className="flex items-center gap-2 border-b pb-3 border-border/40">
              <SlidersHorizontal className="h-4.5 w-4.5 text-foreground" />
              <h2 className="font-medium text-sm uppercase tracking-wider text-foreground">
                Licence Classification
              </h2>
            </div>

            <div className="flex flex-row flex-nowrap overflow-x-auto gap-2 lg:flex-col pb-3 lg:pb-0 scrollbar-none w-full">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon
                const count = categoryCounts[cat.id] || 0
                const isSelected = selectedCategory === cat.id

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      "flex items-center justify-between gap-3 px-4 py-3 rounded-md border text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer w-auto lg:w-full group text-left",
                      isSelected
                        ? "bg-foreground border-foreground text-background"
                        : "bg-card border-border hover:border-foreground/30 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={cn("h-4.5 w-4.5 shrink-0", isSelected ? "text-background" : "text-foreground/70 group-hover:scale-105 transition-transform")} />
                      <span>{cat.label}</span>
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums",
                        isSelected
                          ? "bg-background/20 text-background"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Listings Feed */}
          <div className="lg:col-span-9 space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg text-foreground">
                {selectedCategory === 'all'
                  ? 'Active Job Board'
                  : CATEGORIES.find((c) => c.id === selectedCategory)?.label}
              </h3>
              <p className="text-xs text-muted-foreground font-semibold">
                Showing {filteredListings.length} {filteredListings.length === 1 ? 'result' : 'results'}
              </p>
            </div>

            <ListingGrid listings={filteredListings} />
          </div>
        </div>
      </div>
    </div>
  )
}
