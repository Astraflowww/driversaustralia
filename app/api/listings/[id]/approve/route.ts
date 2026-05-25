import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface ParamsProps {
  params: Promise<{ id: string }>
}

// PATCH /api/listings/[id]/approve - Admin updates listing status
export async function PATCH(request: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // 1. Get authenticated user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Verify admin role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Only administrators can approve listings' }, { status: 403 })
    }

    // 3. Parse input
    const body = await request.json()
    const { status } = body

    if (!status || !['approved', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 })
    }

    // 4. Update status in DB
    const { data: listing, error: updateError } = await supabase
      .from('listings')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (updateError) throw updateError

    return NextResponse.json(listing)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
