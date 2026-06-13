import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface ParamsProps {
  params: Promise<{ id: string }>
}

// PATCH /api/listings/[id]/close - Seller owner closes their listing
export async function PATCH(request: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // 1. Get authenticated user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Fetch the listing to check ownership
    const { data: listing, error: fetchError } = await supabase
      .from('listings')
      .select('seller_id, status')
      .eq('id', id)
      .single()

    if (fetchError || !listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    // 3. Verify owner is current user
    if (listing.seller_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden: You do not own this listing' }, { status: 403 })
    }

    // 4. Update status to 'closed'
    const { data: updatedListing, error: updateError } = await supabase
      .from('listings')
      .update({ status: 'closed' })
      .eq('id', id)
      .select()
      .single()

    if (updateError) throw updateError

    return NextResponse.json(updatedListing)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
