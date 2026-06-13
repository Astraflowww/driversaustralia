'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface CloseListingButtonProps {
  listingId: string
}

export function CloseListingButton({ listingId }: CloseListingButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleClose = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to close this job listing? It will no longer accept responses and will be hidden from candidates.'
    )
    if (!confirmed) return

    setLoading(true)
    try {
      const res = await fetch(`/api/listings/${listingId}/close`, {
        method: 'PATCH',
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to close listing')
      }

      router.refresh()
    } catch (err: any) {
      alert(err.message || 'Something went wrong while closing the listing.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClose}
      disabled={loading}
      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer font-medium transition-all duration-200"
    >
      {loading ? (
        <>
          <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
          Closing...
        </>
      ) : (
        'Close'
      )}
    </Button>
  )
}
