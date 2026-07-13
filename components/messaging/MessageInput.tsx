'use client'

import React, { useState, useRef, useEffect } from 'react'
import { SendHorizontal, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MessageInputProps {
  onSend: (content: string) => Promise<void>
  disabled?: boolean
}

export function MessageInput({ onSend, disabled = false }: MessageInputProps) {
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-expand height
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    // Reset height to compute scrollHeight accurately
    textarea.style.height = 'auto'
    
    // Set height based on scrollHeight, capped at 160px (approx 5 rows)
    const newHeight = Math.min(textarea.scrollHeight, 160)
    textarea.style.height = `${newHeight}px`
  }, [content])

  const handleSend = async () => {
    if (!content.trim() || sending || disabled) return
    
    setSending(true)
    try {
      await onSend(content)
      setContent('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
        textareaRef.current.focus()
      }
    } catch (err) {
      console.error('Failed to send message:', err)
      alert('Could not send message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const charLimit = 5000
  const charCount = content.length
  const showWarning = charCount > charLimit - 500

  return (
    <div className="border-t border-border/40 p-4 bg-background">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-end gap-2 bg-muted/30 border border-border/40 rounded-xl px-3 py-2.5 focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
          <textarea
            ref={textareaRef}
            rows={1}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={disabled || sending}
            className="flex-1 resize-none bg-transparent py-0.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none min-h-[20px] max-h-[160px] text-foreground leading-relaxed"
          />
          <Button
            size="icon"
            variant="default"
            disabled={!content.trim() || disabled || sending || charCount > charLimit}
            onClick={handleSend}
            className="h-8 w-8 rounded-lg shrink-0 cursor-pointer"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SendHorizontal className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Character count limit indicator */}
        {charCount > 0 && (
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] text-muted-foreground">
              Press Enter to send, Shift+Enter for new line
            </span>
            <span className={`text-[10px] ${showWarning ? 'text-amber-500 font-medium' : 'text-muted-foreground/60'}`}>
              {charCount} / {charLimit}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
