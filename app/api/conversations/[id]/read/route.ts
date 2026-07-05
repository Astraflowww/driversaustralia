import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface PageParams {
  params: Promise<{ id: string }>
}

// PATCH /api/conversations/[id]/read - Mark all messages in a conversation as read (except those sent by current user)
export async function PATCH(request: NextRequest, { params }: PageParams) {
  try {
    const { id: conversationId } = await params
    const supabase = await createClient()

    // 1. Authenticate user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Verify participation
    const { data: conversation, error: convoError } = await supabase
      .from('conversations')
      .select('participant_1, participant_2')
      .eq('id', conversationId)
      .single()

    if (convoError || !conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    const isParticipant = conversation.participant_1 === user.id || conversation.participant_2 === user.id
    if (!isParticipant) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 3. Mark incoming messages as read
    const { error: updateError } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('conversation_id', conversationId)
      .neq('sender_id', user.id)
      .eq('is_read', false)

    if (updateError) throw updateError

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
