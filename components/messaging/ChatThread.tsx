'use client'

import React, { useEffect, useRef, useState } from 'react'
import { ChevronDown, MessageSquare } from 'lucide-react'
import { usePollingMessages } from '@/lib/hooks/usePollingMessages'
import { ChatHeader } from './ChatHeader'
import { MessageBubble } from './MessageBubble'
import { MessageInput } from './MessageInput'

interface UserProfile {
  id: string
  full_name: string | null
  email: string
  role: string
}

interface ListingContext {
  id: string
  title: string
  category: string
}

interface ChatThreadProps {
  conversationId: string
  currentUserId: string
  otherUser: UserProfile
  listing: ListingContext | null
  onBack?: () => void
}

export function ChatThread({
  conversationId,
  currentUserId,
  otherUser,
  listing,
  onBack
}: ChatThreadProps) {
  const {
    messages,
    isLoading,
    sendMessage,
    markAsRead
  } = usePollingMessages(conversationId)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showScrollBottomBtn, setShowScrollBottomBtn] = useState(false)
  const [isNearBottom, setIsNearBottom] = useState(true)

  // Scroll to bottom helper
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior })
  }

  // Handle marking messages as read on mount and when new messages arrive
  useEffect(() => {
    markAsRead()
  }, [conversationId, messages.length, markAsRead])

  // Track scrolling status
  const handleScroll = () => {
    const container = scrollContainerRef.current
    if (!container) return

    const { scrollTop, scrollHeight, clientHeight } = container
    const buffer = 100 // px buffer from bottom
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight
    
    const nearBottom = distanceFromBottom <= buffer
    setIsNearBottom(nearBottom)
    
    // Show button if scrolled up by more than 250px
    setShowScrollBottomBtn(scrollTop < scrollHeight - clientHeight - 250)
  };

  // Scroll to bottom on initial load and when sending/receiving messages (if we are near bottom)
  useEffect(() => {
    if (messages.length > 0 && isNearBottom) {
      // Small timeout to allow content render
      setTimeout(() => scrollToBottom('instant'), 50)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length])

  // Force scroll to bottom on initial load completion
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      setTimeout(() => scrollToBottom('instant'), 100)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, conversationId])

  // Helper to determine if we should show date separator
  const renderDateSeparator = (currentMsgDateStr: string, prevMsgDateStr?: string) => {
    const currentDate = new Date(currentMsgDateStr)
    const prevDate = prevMsgDateStr ? new Date(prevMsgDateStr) : null

    // Check if on same calendar day
    if (prevDate && currentDate.toDateString() === prevDate.toDateString()) {
      return null
    }

    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    let dateText = ''
    if (currentDate.toDateString() === today.toDateString()) {
      dateText = 'Today'
    } else if (currentDate.toDateString() === yesterday.toDateString()) {
      dateText = 'Yesterday'
    } else {
      dateText = currentDate.toLocaleDateString([], {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      })
    }

    return (
      <div className="flex items-center justify-center my-4">
        <span className="rounded-full bg-secondary/80 border border-border/30 px-3 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          {dateText}
        </span>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-background/50 relative">
      {/* Active Conversation Header */}
      <ChatHeader otherUser={otherUser} listing={listing} onBack={onBack} />

      {/* Messages Scrollable Area */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-1 scroll-smooth"
      >
        {isLoading ? (
          // Skeleton loading state
          <div className="space-y-4 pt-4">
            <div className="flex justify-start"><div className="h-10 w-[60%] rounded-2xl bg-muted animate-pulse" /></div>
            <div className="flex justify-end"><div className="h-12 w-[45%] rounded-2xl bg-muted animate-pulse" /></div>
            <div className="flex justify-start"><div className="h-10 w-[70%] rounded-2xl bg-muted animate-pulse" /></div>
            <div className="flex justify-end"><div className="h-8 w-[30%] rounded-2xl bg-muted animate-pulse" /></div>
          </div>
        ) : messages.length === 0 ? (
          // Empty conversation state
          <div className="flex h-full flex-col items-center justify-center text-center p-8 space-y-3">
            <div className="rounded-full bg-secondary/60 p-4 border border-border/40">
              <MessageSquare className="h-8 w-8 text-muted-foreground/60" />
            </div>
            <h4 className="font-semibold text-foreground text-sm">No Messages Yet</h4>
            <p className="text-xs text-muted-foreground max-w-[240px] leading-relaxed">
              Introduce yourself and start discussing licensing, requirements, or logistics.
            </p>
          </div>
        ) : (
          // Messages thread
          messages.map((message, index) => {
            const prevMessage = index > 0 ? messages[index - 1] : undefined
            const nextMessage = index < messages.length - 1 ? messages[index + 1] : undefined
            
            // Grouping logic: hide consecutive timestamps if sent by same sender within 5 mins
            const isSameSenderAsNext = nextMessage?.sender_id === message.sender_id
            const isWithinFiveMins = nextMessage 
              ? (new Date(nextMessage.created_at).getTime() - new Date(message.created_at).getTime()) < 5 * 60 * 1000
              : false
            const showTimestamp = !(isSameSenderAsNext && isWithinFiveMins)

            return (
              <React.Fragment key={message.id}>
                {renderDateSeparator(message.created_at, prevMessage?.created_at)}
                <MessageBubble
                  message={message}
                  isOwn={message.sender_id === currentUserId}
                  showTimestamp={showTimestamp}
                />
              </React.Fragment>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Floating Scroll to Bottom Button */}
      {showScrollBottomBtn && (
        <button
          onClick={() => scrollToBottom('smooth')}
          className="absolute bottom-20 right-6 flex h-9 w-9 items-center justify-center rounded-full bg-background border border-border/50 shadow-md text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105 cursor-pointer z-10 animate-bounce"
        >
          <ChevronDown className="h-5 w-5" />
        </button>
      )}

      {/* Message Composer Bar */}
      <MessageInput onSend={sendMessage} disabled={isLoading} />
    </div>
  )
}
