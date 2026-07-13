'use client'

import React from 'react'
import { useUnreadCount } from '@/lib/hooks/useUnreadCount'

export function UnreadBadge() {
  const count = useUnreadCount()

  if (count === 0) return null

  return (
    <span 
      className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-fin-orange px-1 text-[9px] font-bold text-white transition-all duration-300 animate-in zoom-in-50 shrink-0 ml-1.5"
      style={{ boxShadow: '0 0 0 2px var(--background)' }}
    >
      {count > 9 ? '9+' : count}
    </span>
  )
}
