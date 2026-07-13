'use client'

import React from 'react'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { useUnreadCount } from '@/lib/hooks/useUnreadCount'

export function FloatingChatButton() {
  const count = useUnreadCount()

  return (
    <Link 
      href="/messages" 
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center h-14 w-14 rounded-full bg-[#f0a500] hover:bg-[#d08f00] text-white shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 group"
      aria-label="Open Messages"
    >
      <MessageCircle className="h-6 w-6 transition-transform duration-200 group-hover:scale-105" />
      {count > 0 && (
        <span 
          className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ff5600] px-1 text-[10px] font-bold text-white transition-all duration-300 animate-in zoom-in-50"
          style={{ boxShadow: '0 0 0 2px #fff' }}
        >
          {count > 9 ? '9+' : count}
        </span>
      )}
    </Link>
  )
}
