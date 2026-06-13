import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface ParamsProps {
  params: Promise<{ id: string }>
}

// PATCH /api/responses/[id] - Seller updates applicant response status
export async function PATCH(request: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // 1. Get authenticated user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Fetch the response to check seller ownership of the listing
    const { data: response, error: fetchError } = await supabase
      .from('responses')
      .select('id, listing_id, listings (seller_id)')
      .eq('id', id)
      .single()

    if (fetchError || !response) {
      return NextResponse.json({ error: 'Response not found' }, { status: 404 })
    }

    const sellerId = (response.listings as any)?.seller_id
    if (sellerId !== user.id) {
      return NextResponse.json({ error: 'Forbidden: You do not own the listing for this response' }, { status: 403 })
    }

    // 3. Parse and validate status
    const body = await request.json()
    const { status } = body

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 })
    }

    // 4. Update status in database
    const { data: updatedResponse, error: updateError } = await supabase
      .from('responses')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (updateError) throw updateError

    return NextResponse.json(updatedResponse)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
