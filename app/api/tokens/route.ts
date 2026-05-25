import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// PATCH /api/tokens - Admin adjusts user tokens atomically
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()

    // 1. Get authenticated user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Parse body
    const body = await request.json()
    const { target_user_id, token_delta, reason } = body

    if (!target_user_id || token_delta === undefined) {
      return NextResponse.json({ error: 'Missing target user ID or token delta' }, { status: 400 })
    }

    // 3. Execute adjust_user_tokens RPC (checks admin permission, target existence, and does adjustment atomically)
    const { error: adjustError } = await supabase.rpc('adjust_user_tokens', {
      target_user_id,
      admin_user_id: user.id,
      token_delta,
      transaction_reason: reason || 'Admin adjustment'
    })

    if (adjustError) {
      return NextResponse.json({ error: adjustError.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: 'Tokens adjusted successfully' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
