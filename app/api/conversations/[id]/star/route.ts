import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface PageParams {
  params: Promise<{ id: string }>
}

// PATCH /api/conversations/[id]/star - Toggle starred status of a conversation for the current user
export async function PATCH(request: NextRequest, { params }: PageParams) {
  try {
    const { id: conversationId } = await params
    const supabase = await createClient()

    // 1. Authenticate user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Fetch conversation to verify participation and find current status
    const { data: conversation, error: convoError } = await supabase
      .from('conversations')
      .select('participant_1, participant_2, is_starred_p1, is_starred_p2')
      .eq('id', conversationId)
      .single()

    if (convoError || !conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    const isP1 = conversation.participant_1 === user.id
    const isP2 = conversation.participant_2 === user.id

    if (!isP1 && !isP2) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 3. Toggle and save star status
    const updateData: Record<string, boolean> = {}
    let newStarredValue = false

    if (isP1) {
      newStarredValue = !conversation.is_starred_p1
      updateData.is_starred_p1 = newStarredValue
    } else {
      newStarredValue = !conversation.is_starred_p2
      updateData.is_starred_p2 = newStarredValue
    }

    const { error: updateError } = await supabase
      .from('conversations')
      .update(updateData)
      .eq('id', conversationId)

    if (updateError) throw updateError

    return NextResponse.json({ is_starred: newStarredValue })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
