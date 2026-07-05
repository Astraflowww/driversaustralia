import React from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TokenManager } from '@/components/admin/TokenManager'

export const revalidate = 0

export default async function AdminUsersPage() {
  const supabase = await createClient()

  // Get current user session
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch current user details to confirm admin status
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    redirect('/')
  }

  // Fetch all profiles sorted by signup date
  const { data: users = [] } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#d3cec6] pb-4">
        <h1 className="text-2xl font-medium tracking-tight text-[#111111]">Users Management</h1>
        <p className="text-xs text-[#626260] mt-1">
          Monitor registered accounts, change user roles, adjust posting credits, and manage user lifecycles.
        </p>
      </div>

      {/* Users Token Manager Component */}
      <div className="rounded-xl border border-[#d3cec6] bg-white p-6 shadow-sm">
        <TokenManager users={users as any[]} currentAdminId={user.id} />
      </div>
    </div>
  )
}
