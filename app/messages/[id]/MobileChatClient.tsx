'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ChatThread } from '@/components/messaging/ChatThread'

interface MobileChatClientProps {
  currentUserId: string
  conversation: {
    id: string
    listing: { id: string; title: string; category: string } | null
    other_user: { id: string; full_name: string | null; email: string; role: string }
  }
}

export function MobileChatClient({ currentUserId, conversation }: MobileChatClientProps) {
  const router = useRouter()

  const handleBack = () => {
    router.push('/messages')
  }

  return (
    <div className="flex-1 h-full overflow-hidden">
      <ChatThread
        conversationId={conversation.id}
        currentUserId={currentUserId}
        otherUser={conversation.other_user}
        listing={conversation.listing}
        onBack={handleBack}
      />
    </div>
  )
}
