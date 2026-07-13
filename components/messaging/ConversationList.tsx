'use client'

import React, { useState, useMemo } from 'react'
import { Star, Search, MessageSquare, AlertCircle } from 'lucide-react'
import { formatMonthDay } from '@/lib/utils'

export interface ConversationItem {
  id: string
  listing_id: string | null
  listing: { id: string; title: string; category: string } | null
  other_user: { id: string; full_name: string | null; email: string; role: string }
  is_starred: boolean
  last_message: { id: string; content: string; sender_id: string; is_read: boolean; created_at: string } | null
  unread_count: number
  created_at: string
  updated_at: string
}

interface ConversationListProps {
  conversations: ConversationItem[]
  activeId: string | null
  onSelect: (id: string) => void
  onStarToggle: (id: string) => void
}

export function ConversationList({
  conversations,
  activeId,
  onSelect,
  onStarToggle
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'starred'>('all')

  // Relative timestamp helper
  const getRelativeTime = (dateStr?: string) => {
    if (!dateStr) return ''
    const now = new Date()
    const past = new Date(dateStr)
    const diffMs = now.getTime() - past.getTime()

    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'now'
    if (diffMins < 60) return `${diffMins}m`
    if (diffHours < 24) return `${diffHours}h`
    if (diffDays === 1) return 'Yesterday'
    
    // Default: format as month + day (e.g. "3 Jul")
    return formatMonthDay(past)
  }

  // Filter & Search logic
  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      // 1. Apply tab filter
      if (activeTab === 'unread' && c.unread_count === 0) return false
      if (activeTab === 'starred' && !c.is_starred) return false

      // 2. Apply search filter (match on other user's name or listing title)
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase()
        const nameMatch = (c.other_user?.full_name || '').toLowerCase().includes(query)
        const titleMatch = (c.listing?.title || '').toLowerCase().includes(query)
        const emailMatch = (c.other_user?.email || '').toLowerCase().includes(query)
        return nameMatch || titleMatch || emailMatch
      }

      return true
    })
  }, [conversations, activeTab, searchQuery])

  return (
    <div className="flex h-full flex-col bg-background border-r border-border/40 w-full md:max-w-[360px] shrink-0">
      {/* Search Input */}
      <div className="p-4 border-b border-border/40">
        <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">Messages</h2>
        <div className="relative flex items-center bg-muted/40 border border-border/40 rounded-lg px-2.5 py-1.5 focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
          <Search className="h-4 w-4 text-muted-foreground mr-2" />
          <input
            type="text"
            placeholder="Search operator or driver..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-0 text-foreground"
          />
        </div>
      </div>

      {/* Star/Unread Filters Tabs */}
      <div className="flex border-b border-border/20 px-3 py-2 bg-muted/10 gap-1">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold tracking-wide transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-card text-foreground shadow-sm border border-border/40'
              : 'text-muted-foreground hover:bg-secondary/40 hover:text-foreground'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab('unread')}
          className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold tracking-wide transition-all cursor-pointer relative ${
            activeTab === 'unread'
              ? 'bg-card text-foreground shadow-sm border border-border/40'
              : 'text-muted-foreground hover:bg-secondary/40 hover:text-foreground'
          }`}
        >
          Unread
          {conversations.some(c => c.unread_count > 0) && (
            <span className="absolute top-1 right-2.5 h-1.5 w-1.5 rounded-full bg-fin-orange animate-pulse" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('starred')}
          className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold tracking-wide transition-all cursor-pointer ${
            activeTab === 'starred'
              ? 'bg-card text-foreground shadow-sm border border-border/40'
              : 'text-muted-foreground hover:bg-secondary/40 hover:text-foreground'
          }`}
        >
          Starred
        </button>
      </div>

      {/* Conversations Scrollable Feed */}
      <div className="flex-1 overflow-y-auto divide-y divide-border/20">
        {filteredConversations.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center p-6 text-center space-y-2">
            {searchQuery ? (
              <>
                <AlertCircle className="h-6 w-6 text-muted-foreground/60" />
                <p className="text-xs text-muted-foreground font-medium">No results found for &quot;{searchQuery}&quot;</p>
              </>
            ) : (
              <>
                <MessageSquare className="h-6 w-6 text-muted-foreground/60" />
                <p className="text-xs text-muted-foreground font-medium">No conversations in this view</p>
              </>
            )}
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const isActive = conv.id === activeId
            const displayName = conv.other_user?.full_name || 'Anonymous Operator'
            const displayRole = conv.other_user?.role === 'seller' ? 'Operator' : 'Driver'
            const initial = displayName.charAt(0).toUpperCase()
            const time = getRelativeTime(conv.last_message?.created_at || conv.updated_at)

            return (
              <div
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className={`flex gap-3 p-4 items-start relative cursor-pointer hover:bg-muted/10 transition-colors group ${
                  isActive ? 'bg-muted/30 border-l-2 border-primary' : ''
                }`}
              >
                {/* User avatar initial */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-foreground border border-border/60">
                  {initial}
                </div>

                {/* Info and preview */}
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-semibold text-sm truncate text-foreground leading-none">
                        {displayName}
                      </span>
                      <span className="inline-flex items-center rounded bg-muted border border-border/40 px-1 py-0.5 text-[8px] font-bold text-muted-foreground uppercase leading-none scale-95 origin-left select-none">
                        {displayRole}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground tabular-nums shrink-0 ml-2">
                      {time}
                    </span>
                  </div>

                  {conv.listing && (
                    <p className="text-xs text-muted-foreground/80 font-medium truncate leading-none pt-0.5">
                      Re: {conv.listing.title}
                    </p>
                  )}

                  <p className={`text-xs truncate pt-1 leading-normal ${
                    conv.unread_count > 0 ? 'font-semibold text-foreground' : 'text-muted-foreground/70'
                  }`}>
                    {conv.last_message ? conv.last_message.content : 'No messages yet.'}
                  </p>
                </div>

                {/* Right side interactions: Star and Unread dot */}
                <div className="flex flex-col items-end justify-between self-stretch shrink-0 pt-0.5">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      onStarToggle(conv.id)
                    }}
                    className={`p-0.5 hover:bg-secondary rounded hover:text-amber-500 transition-colors md:opacity-0 group-hover:opacity-100 ${
                      conv.is_starred ? 'text-amber-500 md:opacity-100' : 'text-muted-foreground/30'
                    }`}
                  >
                    <Star className="h-4.5 w-4.5" fill={conv.is_starred ? 'currentColor' : 'none'} />
                  </button>

                  {conv.unread_count > 0 && (
                    <span className="h-2 w-2 rounded-full bg-fin-orange animate-pulse mt-2.5 shrink-0" />
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
