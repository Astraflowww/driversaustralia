import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/conversations - List all conversations for the current user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // 1. Authenticate user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') // 'unread' | 'starred' | null

    // 2. Fetch user's profile to check if they are admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role === 'admin'

    // 3. Fetch conversations
    // RLS policy handles restricting non-admins to their own conversations.
    // If not admin, RLS filters. If admin, RLS allows all.
    let query = supabase
      .from('conversations')
      .select(`
        id,
        listing_id,
        participant_1,
        participant_2,
        is_starred_p1,
        is_starred_p2,
        created_at,
        updated_at,
        listings ( id, title, category ),
        p1:profiles!conversations_participant_1_fkey ( id, full_name, email, role ),
        p2:profiles!conversations_participant_2_fkey ( id, full_name, email, role )
      `)
      .order('updated_at', { ascending: false })

    const { data: conversations, error } = await query
    if (error) throw error

    if (!conversations || conversations.length === 0) {
      return NextResponse.json([])
    }

    const conversationIds = conversations.map((c: any) => c.id)

    // 4. Fetch last message and unread count for each conversation
    // Querying all messages from these conversations.
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('id, conversation_id, sender_id, content, is_read, created_at')
      .in('conversation_id', conversationIds)
      .order('created_at', { ascending: false })

    if (messagesError) throw messagesError

    const lastMessages: Record<string, any> = {}
    const unreadCounts: Record<string, number> = {}

    if (messages) {
      for (const msg of messages) {
        // Since we order by created_at DESC, the first message we encounter for a conversation is the last message.
        if (!lastMessages[msg.conversation_id]) {
          lastMessages[msg.conversation_id] = msg
        }
        // Count unread messages where the current user is NOT the sender
        if (msg.sender_id !== user.id && !msg.is_read) {
          unreadCounts[msg.conversation_id] = (unreadCounts[msg.conversation_id] || 0) + 1
        }
      }
    }

    // 5. Format and enrich conversations list
    let enrichedConversations = conversations.map((c: any) => {
      const isP1 = c.participant_1 === user.id
      const otherUser = isP1 ? c.p2 : c.p1
      const isStarred = isP1 ? c.is_starred_p1 : c.is_starred_p2

      return {
        id: c.id,
        listing_id: c.listing_id,
        listing: c.listings,
        other_user: otherUser || { id: isP1 ? c.participant_2 : c.participant_1, full_name: 'Unknown User', email: '', role: 'buyer' },
        is_starred: isStarred,
        last_message: lastMessages[c.id] || null,
        unread_count: unreadCounts[c.id] || 0,
        created_at: c.created_at,
        updated_at: c.updated_at
      }
    })

    // 6. Apply search/filter options
    if (filter === 'unread') {
      enrichedConversations = enrichedConversations.filter((c: any) => c.unread_count > 0)
    } else if (filter === 'starred') {
      enrichedConversations = enrichedConversations.filter((c: any) => c.is_starred)
    }

    return NextResponse.json(enrichedConversations)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/conversations - Create or get a conversation
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // 1. Authenticate user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Validate payload
    const body = await request.json()
    const { listing_id, other_user_id } = body

    if (!listing_id || !other_user_id) {
      return NextResponse.json({ error: 'Missing listing_id or other_user_id' }, { status: 400 })
    }

    if (user.id === other_user_id) {
      return NextResponse.json({ error: 'Cannot start a conversation with yourself' }, { status: 400 })
    }

    // 3. Call DB RPC to get or create conversation atomically
    const { data: conversationId, error } = await supabase.rpc('get_or_create_conversation', {
      p_listing_id: listing_id,
      p_other_user_id: other_user_id
    })

    if (error) throw error

    return NextResponse.json({ id: conversationId })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
