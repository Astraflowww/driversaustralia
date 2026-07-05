import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 0

// GET /api/conversations/unread - Return count of conversations with unread messages for the current user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // 1. Authenticate user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ count: 0 }) // Return 0 instead of 401 to prevent errors on navbar badge
    }

    // 2. Fetch conversations the user is a participant of
    const { data: conversations, error: convoError } = await supabase
      .from('conversations')
      .select('id')
      .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)

    if (convoError || !conversations || conversations.length === 0) {
      return NextResponse.json({ count: 0 })
    }

    const conversationIds = conversations.map((c: any) => c.id)

    // 3. Count conversations that have unread messages sent by the OTHER person
    const { data: unreadMessages, error: messagesError } = await supabase
      .from('messages')
      .select('conversation_id')
      .in('conversation_id', conversationIds)
      .neq('sender_id', user.id)
      .eq('is_read', false)

    if (messagesError) throw messagesError

    // Group by conversation_id to get count of unique conversations with unread messages
    const uniqueUnreadConversations = new Set((unreadMessages || []).map((m: any) => m.conversation_id))

    return NextResponse.json({ count: uniqueUnreadConversations.size })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
