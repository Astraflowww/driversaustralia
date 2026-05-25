import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/listings - Get all approved listings
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('listings')
      .select('*, profiles(full_name)')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/listings - Create listing (Sellers only, spends 1 token)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // 1. Get authenticated user session
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Resolve user role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, tokens')
      .eq('id', user.id)
      .single()

    if (profileError || !profile || profile.role !== 'seller') {
      return NextResponse.json({ error: 'Forbidden: Only sellers can create listings' }, { status: 403 })
    }

    // 3. Parse and validate body
    const body = await request.json()
    const { title, description, category, form_schema } = body

    if (!title || !category || !form_schema || !Array.isArray(form_schema)) {
      return NextResponse.json({ error: 'Invalid listing request parameters' }, { status: 400 })
    }

    // 4. spend_token RPC function (checks balance and deducts 1 token atomically)
    const { error: spendError } = await supabase.rpc('spend_token', {
      seller_id: user.id
    })

    if (spendError) {
      return NextResponse.json({ error: spendError.message || 'Failed to spend token. Insufficient balance.' }, { status: 400 })
    }

    // 5. Insert listing
    const { data: listing, error: insertError } = await supabase
      .from('listings')
      .insert({
        seller_id: user.id,
        title,
        description,
        category,
        form_schema,
        status: 'pending' // Force moderation status
      })
      .select()
      .single()

    if (insertError) throw insertError

    return NextResponse.json(listing, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
