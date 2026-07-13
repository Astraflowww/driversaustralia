'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

export function useUnreadCount(interval = 30000) {
  const [unreadCount, setUnreadCount] = useState(0)
  const isVisible = useRef(true)

  const fetchUnreadCount = useCallback(async () => {
    if (!isVisible.current) return
    try {
      const res = await fetch('/api/conversations/unread')
      if (res.ok) {
        const data = await res.json()
        setUnreadCount(data.count || 0)
      }
    } catch {
      // Ignore count fetch errors
    }
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUnreadCount()
    }, 0)

    const timer = setInterval(fetchUnreadCount, interval)
    return () => {
      clearTimeout(timeoutId)
      clearInterval(timer)
    }
  }, [fetchUnreadCount, interval])

  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisible.current = document.visibilityState === 'visible'
      if (isVisible.current) {
        fetchUnreadCount()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [fetchUnreadCount])

  return unreadCount
}
