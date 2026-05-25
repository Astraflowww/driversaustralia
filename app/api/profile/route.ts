import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// PATCH /api/profile - Update seller profile name and business details
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()

    // 1. Get authenticated user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Parse request body
    const body = await request.json()
    const { full_name, business_name, business_phone, abn, business_address } = body

    // 3. Update profile details
    // Note: The database RLS policy allows users to update their own profile columns
    // except role and tokens.
    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name,
        business_name,
        business_phone,
        abn,
        business_address
      })
      .eq('id', user.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
