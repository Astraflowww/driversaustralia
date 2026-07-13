'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'

interface UserProfile {
  full_name: string | null
  email: string
  role: string
}

interface ListingContext {
  id: string
  title: string
  category: string
}

interface ChatHeaderProps {
  otherUser: UserProfile
  listing: ListingContext | null
  onBack?: () => void
}

export function ChatHeader({ otherUser, listing, onBack }: ChatHeaderProps) {
  // Category badge styles
  const categoryStyles: Record<string, string> = {
    mc: 'bg-[#65b5ff]/10 text-[#006bd6] border-[#65b5ff]/20', // report-blue
    hc: 'bg-[#0bdf50]/10 text-[#079c37] border-[#0bdf50]/20', // report-green
    hr: 'bg-[#03b2cb]/10 text-[#028194] border-[#03b2cb]/20', // report-cyan
    mr: 'bg-fin-orange/10 text-fin-orange border-fin-orange/20', // fin-orange
    lr: 'bg-[#ff2067]/10 text-[#cc0044] border-[#ff2067]/20', // report-pink
    car: 'bg-[#8b5cf6]/10 text-[#6d28d9] border-[#8b5cf6]/20', // purple
    other: 'bg-muted text-muted-foreground border-border',
  }

  const categoryLabels: Record<string, string> = {
    mc: 'MC Licence',
    hc: 'HC Licence',
    hr: 'HR Licence',
    mr: 'MR Licence',
    lr: 'LR Licence',
    car: 'Car Licence (C)',
    other: 'Specialized',
  }

  const badgeStyle = listing ? (categoryStyles[listing.category] || categoryStyles.other) : ''
  const categoryLabel = listing ? (categoryLabels[listing.category] || listing.category.toUpperCase()) : ''

  const displayName = otherUser.full_name || 'Anonymous User'
  const displayRole = otherUser.role === 'seller' 
    ? 'Business Owner' 
    : otherUser.role === 'buyer' 
      ? 'Driver' 
      : otherUser.role === 'admin' 
        ? 'Admin' 
        : otherUser.role

  const initial = displayName.charAt(0).toUpperCase()

  return (
    <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border/40 bg-background/80 px-4 backdrop-blur-md">
      {/* Left side: Back button and User Profile */}
      <div className="flex items-center gap-3 overflow-hidden">
        {onBack && (
          <button 
            onClick={onBack}
            className="rounded-lg p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground md:hidden transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-foreground border border-border/60">
          {initial}
        </div>
        <div className="flex flex-col overflow-hidden leading-tight">
          <span className="truncate text-sm font-semibold text-foreground">
            {displayName}
          </span>
          <span className="text-[10px] text-muted-foreground font-medium capitalize">
            {displayRole}
          </span>
        </div>
      </div>

      {/* Right side: Listing Context link */}
      {listing && (
        <div className="max-w-[50%] shrink-0 text-right">
          <Link 
            href={`/listings/${listing.id}`}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors group"
          >
            <span className="truncate max-w-[140px] md:max-w-[200px] font-medium leading-none">
              Re: {listing.title}
            </span>
            <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-semibold border ${badgeStyle} shrink-0`}>
              {categoryLabel}
            </span>
            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>
      )}
    </div>
  )
}
