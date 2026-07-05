import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface PageParams {
  params: Promise<{ id: string }>
}

// GET /api/conversations/[id]/messages - Get messages in a conversation
export async function GET(request: NextRequest, { params }: PageParams) {
  try {
    const { id: conversationId } = await params
    const supabase = await createClient()

    // 1. Authenticate user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Verify user is participant or admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role === 'admin'

    const { data: conversation, error: convoError } = await supabase
      .from('conversations')
      .select('participant_1, participant_2')
      .eq('id', conversationId)
      .single()

    if (convoError || !conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    const isParticipant = conversation.participant_1 === user.id || conversation.participant_2 === user.id
    if (!isParticipant && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 3. Handle query params for polling and pagination
    const { searchParams } = new URL(request.url)
    const after = searchParams.get('after') // For polling new messages
    const cursor = searchParams.get('cursor') // For scrolling back/history pagination
    const limit = parseInt(searchParams.get('limit') || '50', 10)

    let query = supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)

    if (after) {
      // Polling mode: fetch all new messages since 'after' timestamp
      query = query.gt('created_at', after).order('created_at', { ascending: true })
    } else if (cursor) {
      // Pagination mode: fetch older messages than the cursor
      query = query.lt('created_at', cursor).order('created_at', { ascending: false }).limit(limit + 1)
    } else {
      // Default initial load: fetch most recent messages (e.g. last 50)
      query = query.order('created_at', { ascending: false }).limit(limit + 1)
    }

    const { data: messages, error: messagesError } = await query
    if (messagesError) throw messagesError

    let responseMessages = messages || []
    let hasMore = false

    if (!after) {
      // If we fetched history (DESC order), we check if there's more and reverse to make it ASC
      if (responseMessages.length > limit) {
        hasMore = true
        responseMessages = responseMessages.slice(0, limit)
      }
      responseMessages = responseMessages.reverse()
    }

    return NextResponse.json({
      messages: responseMessages,
      has_more: hasMore
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/conversations/[id]/messages - Send a message in a conversation
export async function POST(request: NextRequest, { params }: PageParams) {
  try {
    const { id: conversationId } = await params
    const supabase = await createClient()

    // 1. Authenticate user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Validate payload
    const body = await request.json()
    const { content } = body

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Message content cannot be empty' }, { status: 400 })
    }

    const trimmedContent = content.trim()
    if (trimmedContent.length > 5000) {
      return NextResponse.json({ error: 'Message is too long (max 5000 characters)' }, { status: 400 })
    }

    // 3. Verify participation (or admin role)
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
      // Check admin status
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      
      if (profile?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    // 4. Insert message
    const { data: message, error: insertError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: trimmedContent
      })
      .select()
      .single()

    if (insertError) throw insertError

    return NextResponse.json(message, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
