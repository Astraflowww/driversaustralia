'use client'

import React from 'react'
import { Check, CheckCheck } from 'lucide-react'
import { Message } from '@/lib/hooks/usePollingMessages'

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
  showTimestamp?: boolean
}

export function MessageBubble({ message, isOwn, showTimestamp = true }: MessageBubbleProps) {
  const formattedTime = new Date(message.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className={`flex w-full flex-col ${isOwn ? 'items-end' : 'items-start'} mb-2`}>
      <div
        className={`max-w-[75%] px-4 py-2.5 text-sm leading-relaxed transition-all duration-200 ${
          isOwn
            ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-sm border border-primary'
            : 'bg-muted text-foreground rounded-2xl rounded-bl-sm border border-border/30'
        }`}
      >
        <div className="whitespace-pre-wrap break-words">{message.content}</div>
        
        <div className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
          isOwn ? 'text-primary-foreground/60' : 'text-muted-foreground/60'
        }`}>
          {showTimestamp && <span>{formattedTime}</span>}
          {isOwn && (
            message.is_read ? (
              <CheckCheck className="h-3 w-3 text-emerald-400" />
            ) : (
              <Check className="h-3 w-3" />
            )
          )}
        </div>
      </div>
    </div>
  )
}
