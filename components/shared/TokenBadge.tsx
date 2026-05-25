'use client'

import React from 'react'
import { Coins } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TokenBadgeProps {
  tokens: number
  className?: string
  showText?: boolean
}

export function TokenBadge({ tokens, className, showText = true }: TokenBadgeProps) {
  const isZero = tokens === 0
  const isLow = tokens > 0 && tokens <= 2

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all duration-200",
        isZero
          ? "bg-destructive/10 border-destructive/20 text-destructive"
          : "bg-fin-orange/10 border-fin-orange/20 text-fin-orange",
        className
      )}
    >
      <Coins className="h-3.5 w-3.5" />
      <span>
        {tokens} {showText && (tokens === 1 ? 'Token' : 'Tokens')}
      </span>
    </div>
  )
}
