'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MessageSquare, AlertCircle, Loader2 } from 'lucide-react'
import { ConversationList, ConversationItem } from '@/components/messaging/ConversationList'
import { ChatThread } from '@/components/messaging/ChatThread'

interface MessagesClientProps {
  currentUserId: string
  initialActiveId: string | null
}

export function MessagesClient({ 
  currentUserId, 
  initialActiveId 
}: MessagesClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [conversations, setConversations] = useState<ConversationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Use URL-driven state for active ID to keep inbox linkable
  const activeId = searchParams.get('id') || initialActiveId
  const isVisible = useRef(true)

  // Fetch all conversations
  const fetchConversations = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true)
    try {
      const res = await fetch('/api/conversations')
      if (!res.ok) throw new Error('Failed to load conversations')
      const data = await res.json()
      setConversations(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      if (!isSilent) setLoading(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchConversations()
    }, 0)
    return () => clearTimeout(timeoutId)
  }, [fetchConversations])

  // Polling conversations list (slower frequency, e.g. every 8 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      if (isVisible.current) {
        fetchConversations(true)
      }
    }, 8000)
    return () => clearInterval(timer)
  }, [fetchConversations])

  // Monitor visibility for conversations polling
  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisible.current = document.visibilityState === 'visible'
      if (isVisible.current) {
        fetchConversations(true)
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [fetchConversations])

  // Handle list selection
  const handleSelectConversation = (id: string) => {
    // If mobile: navigate to full page conversation view
    const isMobile = window.innerWidth < 768
    if (isMobile) {
      router.push(`/messages/${id}`)
    } else {
      // Desktop: update URL search parameters without page reload
      router.push(`/messages?id=${id}`)
    }
  }

  // Handle starring toggle
  const handleStarToggle = async (id: string) => {
    try {
      const res = await fetch(`/api/conversations/${id}/star`, {
        method: 'PATCH'
      })
      if (!res.ok) throw new Error()
      const data = await res.json()

      setConversations(prev => 
        prev.map(c => c.id === id ? { ...c, is_starred: data.is_starred } : c)
      )
    } catch {
      alert('Could not update starred status. Please try again.')
    }
  }

  // Active conversation object
  const activeConversation = conversations.find(c => c.id === activeId)

  return (
    <div className="flex h-full w-full overflow-hidden">
      {loading && conversations.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error && conversations.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
          <AlertCircle className="h-10 w-10 text-destructive" />
          <h4 className="font-semibold text-foreground text-sm">Failed to Load Inbox</h4>
          <p className="text-xs text-muted-foreground max-w-[260px] leading-relaxed">{error}</p>
        </div>
      ) : (
        <>
          {/* Conversation List Sidebar */}
          <ConversationList
            conversations={conversations}
            activeId={activeId}
            onSelect={handleSelectConversation}
            onStarToggle={handleStarToggle}
          />

          {/* Active Conversation Detail Thread Pane */}
          <div className="flex-1 h-full hidden md:block border-l border-border/20">
            {activeConversation ? (
              <ChatThread
                conversationId={activeConversation.id}
                currentUserId={currentUserId}
                otherUser={activeConversation.other_user}
                listing={activeConversation.listing}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center p-8 space-y-3 bg-muted/10">
                <div className="rounded-full bg-secondary/60 p-4 border border-border/40">
                  <MessageSquare className="h-8 w-8 text-muted-foreground/60" />
                </div>
                <h4 className="font-semibold text-foreground text-sm">Select a Conversation</h4>
                <p className="text-xs text-muted-foreground max-w-[240px] leading-relaxed">
                  Choose a chat from the sidebar to start messaging. Discuss positions, rates, and licensing details.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
