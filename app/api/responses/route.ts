import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/responses - Submit a buyer response (dynamic questionnaire)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const body = await request.json()
    const { listing_id, buyer_id, form_data } = body

    if (!listing_id || !form_data) {
      return NextResponse.json({ error: 'Missing listing ID or response data' }, { status: 400 })
    }

    // 1. Verify listing is approved
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('status')
      .eq('id', listing_id)
      .single()

    if (listingError || !listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    if (listing.status !== 'approved') {
      return NextResponse.json({ error: 'Forbidden: Cannot submit response to a listing that is not approved' }, { status: 403 })
    }

    // 2. Insert response
    const { data: response, error: insertError } = await supabase
      .from('responses')
      .insert({
        listing_id,
        buyer_id: buyer_id || null, // Optional authenticated buyer
        form_data
      })
      .select()
      .single()

    if (insertError) throw insertError

    return NextResponse.json(response, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// GET /api/responses - Get responses for a listing (Requires seller owner or admin auth)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const listingId = searchParams.get('listing_id')

    if (!listingId) {
      return NextResponse.json({ error: 'Missing listing_id query parameter' }, { status: 400 })
    }

    const supabase = await createClient()

    // 1. Authenticate user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Verify listing ownership or admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const { data: listing } = await supabase
      .from('listings')
      .select('seller_id')
      .eq('id', listingId)
      .single()

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    const isOwner = listing.seller_id === user.id
    const isAdmin = profile?.role === 'admin'

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden: You do not have permission to view responses' }, { status: 403 })
    }

    // 3. Fetch responses with buyer profiles
    const { data: responses, error } = await supabase
      .from('responses')
      .select('*, profiles(email, full_name)')
      .eq('listing_id', listingId)
      .order('submitted_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(responses)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
