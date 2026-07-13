'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MessageSquare, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface StartChatButtonProps {
  listingId: string
  otherUserId: string
  label?: string
  className?: string
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function StartChatButton({
  listingId,
  otherUserId,
  label = 'Message',
  className = '',
  variant = 'secondary',
  size = 'sm'
}: StartChatButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleStartChat = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (loading) return
    setLoading(true)

    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: listingId,
          other_user_id: otherUserId
        })
      })

      if (!res.ok) {
        throw new Error('Failed to create or open conversation')
      }

      const data = await res.json()
      router.push(`/messages?id=${data.id}`)
    } catch (err) {
      console.error('Start chat error:', err)
      alert('Could not open conversation. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleStartChat}
      disabled={loading}
      className={`gap-1.5 cursor-pointer hover:bg-secondary/80 ${className}`}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      ) : (
        <MessageSquare className="h-4 w-4" />
      )}
      {label}
    </Button>
  )
}
