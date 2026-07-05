import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const DEFAULT_SETTINGS: Record<string, any> = {
  signup_tokens: 5,
  listing_token_cost: 1,
  site_name: 'Drivers Australia',
  support_email: 'support@driversaustralia.com.au',
  maintenance_mode: false,
}

// GET /api/admin/settings - Retrieve global settings (public access or admin access, but public is fine as they are not sensitive)
export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('system_settings')
      .select('key, value')

    const settings = { ...DEFAULT_SETTINGS }

    if (!error && data) {
      data.forEach((row) => {
        settings[row.key] = row.value
      })
    }

    return NextResponse.json({ success: true, settings })
  } catch (err: any) {
    // Graceful fallback to default settings if query fails (e.g. table not migrated yet)
    return NextResponse.json({ success: true, settings: DEFAULT_SETTINGS })
  }
}

// POST /api/admin/settings - Update global settings (restricted to admins)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // 1. Get authenticated user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Fetch profile and verify role is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 3. Parse and validate body
    const body = await request.json()
    const { settings } = body

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Invalid settings object' }, { status: 400 })
    }

    // 4. Save settings using upsert
    const upsertData = Object.entries(settings).map(([key, value]) => ({
      key,
      value,
      updated_at: new Date().toISOString(),
    }))

    const { error: upsertError } = await supabase
      .from('system_settings')
      .upsert(upsertData, { onConflict: 'key' })

    if (upsertError) {
      return NextResponse.json({ 
        error: upsertError.message, 
        hint: 'Please ensure that the system_settings table exists in your database. Run the migration query in supabase/migrations/012_system_settings.sql in the Supabase console.'
      }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Settings saved successfully' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
