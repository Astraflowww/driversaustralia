'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Loader2, Check, X } from 'lucide-react'

interface ResponseStatusActionsProps {
  responseId: string
  currentStatus: 'pending' | 'approved' | 'rejected'
}

export function ResponseStatusActions({ responseId, currentStatus }: ResponseStatusActionsProps) {
  const router = useRouter()
  const [loadingAction, setLoadingAction] = useState<'approved' | 'rejected' | null>(null)

  const handleStatusUpdate = async (status: 'approved' | 'rejected') => {
    const actionText = status === 'approved' ? 'approve' : 'reject'
    const confirmed = window.confirm(`Are you sure you want to ${actionText} this driver application?`)
    if (!confirmed) return

    setLoadingAction(status)
    try {
      const res = await fetch(`/api/responses/${responseId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update response status')
      }

      router.refresh()
    } catch (err: any) {
      alert(err.message || 'Something went wrong while updating the status.')
    } finally {
      setLoadingAction(null)
    }
  }

  if (currentStatus === 'approved') {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-green-500/10 border border-green-500/20 px-2.5 py-0.5 text-xs font-semibold text-green-600">
        <Check className="h-3 w-3 shrink-0" />
        Approved
      </span>
    )
  }

  if (currentStatus === 'rejected') {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-destructive/10 border border-destructive/20 px-2.5 py-0.5 text-xs font-semibold text-destructive">
        <X className="h-3 w-3 shrink-0" />
        Rejected
      </span>
    )
  }

  return (
    <div className="flex items-center gap-1.5 justify-end">
      <Button
        variant="outline"
        size="sm"
        disabled={loadingAction !== null}
        onClick={() => handleStatusUpdate('approved')}
        className="h-8 text-xs bg-green-500/10 border-green-500/20 text-green-600 hover:bg-green-500/20 hover:text-green-700 cursor-pointer flex items-center gap-1 shadow-none transition-all duration-200"
      >
        {loadingAction === 'approved' ? (
          <Loader2 className="h-3 w-3 animate-spin shrink-0" />
        ) : (
          <Check className="h-3 w-3 shrink-0" />
        )}
        Approve
      </Button>

      <Button
        variant="ghost"
        size="sm"
        disabled={loadingAction !== null}
        onClick={() => handleStatusUpdate('rejected')}
        className="h-8 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive cursor-pointer flex items-center gap-1 transition-all duration-200"
      >
        {loadingAction === 'rejected' ? (
          <Loader2 className="h-3 w-3 animate-spin shrink-0" />
        ) : (
          <X className="h-3 w-3 shrink-0" />
        )}
        Reject
      </Button>
    </div>
  )
}
