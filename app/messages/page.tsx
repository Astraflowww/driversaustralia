import React from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MessagesClient } from './MessagesClient'

export const revalidate = 0

interface PageProps {
  searchParams: Promise<{ id?: string }>
}

export default async function MessagesPage({ searchParams }: PageProps) {
  const { id: activeId } = await searchParams
  const supabase = await createClient()

  // 1. Authenticate user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login?redirect=/messages')
  }

  // 2. Fetch current profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, email, role')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/')
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 h-[calc(100vh-4rem-3rem)] min-h-[500px]">
      <div className="h-full border border-border/40 rounded-2xl bg-card/60 backdrop-blur-md overflow-hidden flex shadow-sm">
        <MessagesClient 
          currentUserId={user.id}
          initialActiveId={activeId || null} 
        />
      </div>
    </div>
  )
}
