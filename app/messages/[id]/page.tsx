import React from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MobileChatClient } from './MobileChatClient'

export const revalidate = 0

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function MobileConversationPage({ params }: PageProps) {
  const { id: conversationId } = await params
  const supabase = await createClient()

  // 1. Authenticate user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect(`/login?redirect=/messages/${conversationId}`)
  }

  // 2. Fetch user's profile to check if they are admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, email, role')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/')
  }

  const isAdmin = profile.role === 'admin'

  // 3. Fetch conversation details to verify access and load metadata
  // RLS handles the security check, but we fetch to build headers.
  const { data: conversation, error } = await supabase
    .from('conversations')
    .select(`
      id,
      listing_id,
      participant_1,
      participant_2,
      listings ( id, title, category ),
      p1:profiles!conversations_participant_1_fkey ( id, full_name, email, role ),
      p2:profiles!conversations_participant_2_fkey ( id, full_name, email, role )
    `)
    .eq('id', conversationId)
    .single()

  if (error || !conversation) {
    redirect('/messages')
  }

  const isP1 = conversation.participant_1 === user.id
  const isP2 = conversation.participant_2 === user.id

  if (!isP1 && !isP2 && !isAdmin) {
    redirect('/messages')
  }

  // Determine other participant profile
  const otherUser = isP1 ? conversation.p2 : conversation.p1

  const enrichedConvo = {
    id: conversation.id,
    listing: conversation.listings as unknown as { id: string; title: string; category: string } | null,
    other_user: (otherUser || { id: isP1 ? conversation.participant_2 : conversation.participant_1, full_name: 'Unknown User', email: '', role: 'buyer' }) as unknown as { id: string; full_name: string | null; email: string; role: string }
  }

  return (
    <div className="h-[calc(100vh-4rem)] w-full bg-background flex flex-col md:hidden">
      <MobileChatClient 
        currentUserId={user.id}
        conversation={enrichedConvo}
      />
    </div>
  )
}
