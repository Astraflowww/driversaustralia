'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Check, AlertCircle, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Profile {
  id: string
  full_name: string | null
  business_name: string | null
  business_phone: string | null
  abn: string | null
  business_address: string | null
}

interface BusinessProfileFormProps {
  initialProfile: Profile
  onSuccess?: () => void
}

export function BusinessProfileForm({ initialProfile, onSuccess }: BusinessProfileFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [fullName, setFullName] = useState(initialProfile.full_name || '')
  const [businessName, setBusinessName] = useState(initialProfile.business_name || '')
  const [businessPhone, setBusinessPhone] = useState(initialProfile.business_phone || '')
  const [abn, setAbn] = useState(initialProfile.abn || '')
  const [businessAddress, setBusinessAddress] = useState(initialProfile.business_address || '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    if (!businessName.trim() || !businessPhone.trim() || !abn.trim() || !businessAddress.trim()) {
      setError('All business details fields are required.')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: fullName.trim(),
          business_name: businessName.trim(),
          business_phone: businessPhone.trim(),
          abn: abn.trim(),
          business_address: businessAddress.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile.')
      }

      setSuccess(true)
      router.refresh()
      if (onSuccess) {
        onSuccess()
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-border bg-card shadow-none rounded-lg max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-lg font-medium tracking-tight flex items-center gap-2 text-foreground">
          <Building2 className="h-5 w-5 text-foreground" />
          Business Profile Details
        </CardTitle>
        <CardDescription>
          Provide your business profile credentials before publishing listings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive font-medium flex items-center gap-2 animate-in fade-in duration-200">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-3 text-sm text-green-600 font-medium flex items-center gap-2 animate-in fade-in duration-200">
              <Check className="h-4 w-4 shrink-0" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="fullName">Contact Full Name</Label>
            <Input
              id="fullName"
              placeholder="e.g. John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="bg-background"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="businessName">Registered Business Name</Label>
              <Input
                id="businessName"
                placeholder="e.g. Apex Drivers Logistics"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
                className="bg-background"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="abn">Australian Business Number (ABN)</Label>
              <Input
                id="abn"
                placeholder="e.g. 51 824 753 556"
                value={abn}
                onChange={(e) => setAbn(e.target.value)}
                required
                className="bg-background"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="businessPhone">Business Phone Number</Label>
            <Input
              id="businessPhone"
              placeholder="e.g. +61 491 570 156"
              type="tel"
              value={businessPhone}
              onChange={(e) => setBusinessPhone(e.target.value)}
              required
              className="bg-background"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="businessAddress">Business Address</Label>
            <Input
              id="businessAddress"
              placeholder="e.g. Suite 4, Level 10, 100 Queen St, Melbourne VIC 3000"
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
              required
              className="bg-background"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-none gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Business Details'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
