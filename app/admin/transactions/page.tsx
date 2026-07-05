import React from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TransactionsTableClient } from '@/components/admin/TransactionsTableClient'

export const revalidate = 0

export default async function AdminTransactionsPage() {
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

  // 1. Fetch all transactions
  const { data: txsData = [] } = await supabase
    .from('token_transactions')
    .select('*')
    .order('created_at', { ascending: false })

  // 2. Resolve user/admin details for transactions in-memory to prevent complex ambiguity join errors
  const userIds = Array.from(new Set([
    ...txsData.map(t => t.user_id),
    ...txsData.map(t => t.admin_id).filter(Boolean)
  ]))
  
  const { data: txProfiles = [] } = userIds.length > 0 
    ? await supabase.from('profiles').select('id, email, full_name').in('id', userIds)
    : { data: [] }

  const profileMap = new Map(txProfiles.map(p => [p.id, p]))

  const transactions = txsData.map(t => ({
    ...t,
    user: profileMap.get(t.user_id) || null,
    admin: t.admin_id ? profileMap.get(t.admin_id) || null : null
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#d3cec6] pb-4">
        <h1 className="text-2xl font-medium tracking-tight text-[#111111]">Token Audit Ledger</h1>
        <p className="text-xs text-[#626260] mt-1">
          Complete system logs of all seller credit deposits, registrations bonuses, and token usage deductions.
        </p>
      </div>

      {/* Transactions Client Table wrapper */}
      <div className="rounded-xl border border-[#d3cec6] bg-white p-6 shadow-sm">
        <TransactionsTableClient initialTransactions={transactions as any[]} />
      </div>
    </div>
  )
}
