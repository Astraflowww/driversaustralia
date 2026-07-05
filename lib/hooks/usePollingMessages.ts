'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  is_read: boolean
  created_at: string
}

export function usePollingMessages(conversationId: string | null, interval = 3000) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const lastFetchedAt = useRef<string | null>(null)
  const isVisible = useRef(true)

  // Fetch initial messages
  const fetchMessages = useCallback(async () => {
    if (!conversationId) {
      setMessages([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`)
      if (!res.ok) throw new Error('Failed to load message history')
      const data = await res.json()
      
      const loadedMessages = data.messages || []
      setMessages(loadedMessages)
      
      if (loadedMessages.length > 0) {
        lastFetchedAt.current = loadedMessages[loadedMessages.length - 1].created_at
      } else {
        lastFetchedAt.current = null
      }
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [conversationId])

  // Poll for new messages
  const pollNewMessages = useCallback(async () => {
    if (!conversationId || !isVisible.current) return

    try {
      const url = lastFetchedAt.current
        ? `/api/conversations/${conversationId}/messages?after=${encodeURIComponent(lastFetchedAt.current)}`
        : `/api/conversations/${conversationId}/messages`

      const res = await fetch(url)
      if (!res.ok) return
      const data = await res.json()

      const newMsgs = data.messages || []
      if (newMsgs.length > 0) {
        setMessages(prev => {
          const existingIds = new Set(prev.map(m => m.id))
          const filteredNew = newMsgs.filter((m: Message) => !existingIds.has(m.id))
          if (filteredNew.length === 0) return prev
          
          const merged = [...prev, ...filteredNew].sort(
            (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          )
          return merged
        })
        lastFetchedAt.current = newMsgs[newMsgs.length - 1].created_at
      }
    } catch {
      // Ignore polling errors to prevent noisy UI console logs
    }
  }, [conversationId])

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    if (!conversationId) return

    const res = await fetch(`/api/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    })

    if (!res.ok) {
      const errData = await res.json()
      throw new Error(errData.error || 'Failed to send message')
    }

    const newMsg = await res.json()
    setMessages(prev => {
      const existingIds = new Set(prev.map(m => m.id))
      if (existingIds.has(newMsg.id)) return prev
      return [...prev, newMsg]
    })
    lastFetchedAt.current = newMsg.created_at
    return newMsg
  }, [conversationId])

  // Mark messages in this conversation as read
  const markAsRead = useCallback(async () => {
    if (!conversationId) return
    try {
      await fetch(`/api/conversations/${conversationId}/read`, {
        method: 'PATCH'
      })
    } catch {
      // Ignore errors
    }
  }, [conversationId])

  // Reset states and load initial history when conversation changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchMessages()
    }, 0)
    return () => clearTimeout(timeoutId)
  }, [conversationId, fetchMessages])

  // Set up polling interval
  useEffect(() => {
    if (!conversationId) return
    const timer = setInterval(pollNewMessages, interval)
    return () => clearInterval(timer)
  }, [conversationId, interval, pollNewMessages])

  // Monitor visibility to pause polling on inactive tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisible.current = document.visibilityState === 'visible'
      if (isVisible.current) {
        pollNewMessages()
        markAsRead()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [pollNewMessages, markAsRead])

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    markAsRead,
    refetch: fetchMessages
  }
}
