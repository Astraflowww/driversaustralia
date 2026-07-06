import React from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SettingsFormClient } from '@/components/admin/SettingsFormClient'

export const revalidate = 0

const DEFAULT_SETTINGS = {
  signup_tokens: 5,
  listing_token_cost: 1,
  site_name: 'Drivers Australia',
  support_email: 'support@driversaustralia.com.au',
  maintenance_mode: false,
}

export default async function AdminSettingsPage() {
  const supabase = await createClient()

  // Get current user session
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch admin profile to confirm role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    redirect('/')
  }

  // Fetch settings from database
  let dbSettings = { ...DEFAULT_SETTINGS }
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('key, value')

    if (!error && data) {
      (data as any[]).forEach((row: any) => {
        (dbSettings as any)[row.key] = row.value
      })
    }
  } catch (e) {
    console.warn('System settings table not queryable, using defaults:', e)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#d3cec6] pb-4">
        <h1 className="text-2xl font-medium tracking-tight text-[#111111]">Global Site Settings</h1>
        <p className="text-xs text-[#626260] mt-1">
          Configure site-wide preferences, initial credit reward settings, posting fees, and administrative status.
        </p>
      </div>

      {/* Settings Form Card */}
      <div className="rounded-xl border border-[#d3cec6] bg-white p-6 md:p-8 shadow-sm">
        <SettingsFormClient initialSettings={dbSettings as any} />
      </div>
    </div>
  )
}
