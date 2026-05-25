import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface ParamsProps {
  params: Promise<{ id: string }>
}

// GET /api/listings/[id] - Get a single listing
export async function GET(request: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('listings')
      .select('*, profiles(full_name)')
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PATCH /api/listings/[id] - Update listing details (forces status back to pending)
export async function PATCH(request: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check ownership of listing
    const { data: existingListing, error: fetchError } = await supabase
      .from('listings')
      .select('seller_id')
      .eq('id', id)
      .single()

    if (fetchError || !existingListing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    if (existingListing.seller_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden: You do not own this listing' }, { status: 403 })
    }

    const body = await request.json()
    const { title, description, category, form_schema } = body

    const { data, error } = await supabase
      .from('listings')
      .update({
        title,
        description,
        category,
        form_schema,
        status: 'pending' // Revert to pending on updates
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// DELETE /api/listings/[id] - Delete a listing (Seller owner or Admin only)
export async function DELETE(request: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Resolve requester role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    // Check ownership of listing
    const { data: existingListing } = await supabase
      .from('listings')
      .select('seller_id')
      .eq('id', id)
      .single()

    if (!existingListing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    const isOwner = existingListing.seller_id === user.id
    const isAdmin = profile?.role === 'admin'

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error: deleteError } = await supabase
      .from('listings')
      .delete()
      .eq('id', id)

    if (deleteError) throw deleteError

    return NextResponse.json({ success: true, message: 'Listing deleted successfully' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
