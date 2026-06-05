'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, SendHorizontal, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface DynamicField {
  id: string
  label: string
  type: 'text' | 'textarea' | 'tel' | 'select'
  required: boolean
  options?: string[]
}

interface BuyerResponseFormProps {
  listingId: string
  fields: DynamicField[]
}

export function BuyerResponseForm({ listingId, fields }: BuyerResponseFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))
    // Clear error for this field
    if (errors[fieldId]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[fieldId]
        return next
      })
    }
  }

  const validate = () => {
    const nextErrors: Record<string, string> = {}
    
    fields.forEach((field) => {
      const val = (formData[field.id] || '').trim()
      
      if (field.required && !val) {
        nextErrors[field.id] = `${field.label} is required`
      }
      
      if (field.type === 'tel' && val) {
        // Simple phone regex validation if provided
        const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/
        if (!phoneRegex.test(val)) {
          nextErrors[field.id] = 'Please provide a valid phone number'
        }
      }
    })

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGlobalError(null)

    if (!validate()) return

    setLoading(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      // Submit the response to API
      const res = await fetch('/api/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listing_id: listingId,
          buyer_id: user?.id || null, // Optional, can be anonymous
          form_data: formData,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit response.')
      }

      setSubmitted(true)
      router.refresh()
    } catch (err: any) {
      setGlobalError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <Card className="border-border bg-card text-center p-8 rounded-lg shadow-none animate-in zoom-in-95 duration-200">
        <CardContent className="flex flex-col items-center justify-center space-y-4 pt-6">
          <div className="rounded-md bg-green-500/10 p-3 text-green-600">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-medium tracking-tight text-green-600">Application Submitted!</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Thank you for applying. Your details have been submitted to the business owner and are awaiting review.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {globalError && (
        <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3.5 text-sm text-destructive flex items-center gap-2 animate-in fade-in duration-200">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{globalError}</span>
        </div>
      )}

      {fields.map((field) => {
        const error = errors[field.id]
        
        return (
          <div key={field.id} className="space-y-1.5">
            <Label htmlFor={field.id} className="flex items-center gap-1.5 font-semibold text-sm">
              {field.label}
              {field.required && (
                <span className="text-destructive font-bold text-xs" aria-hidden="true">*</span>
              )}
            </Label>

            {field.type === 'text' && (
              <Input
                id={field.id}
                type="text"
                placeholder={`Enter your ${field.label.toLowerCase()}`}
                value={formData[field.id] || ''}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                className={cn("bg-background/80", error && "border-destructive focus-visible:ring-destructive/30")}
              />
            )}

            {field.type === 'textarea' && (
              <Textarea
                id={field.id}
                placeholder={`Enter your ${field.label.toLowerCase()}`}
                value={formData[field.id] || ''}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                rows={4}
                className={cn("bg-background/80", error && "border-destructive focus-visible:ring-destructive/30")}
              />
            )}

            {field.type === 'tel' && (
              <Input
                id={field.id}
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData[field.id] || ''}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                className={cn("bg-background/80", error && "border-destructive focus-visible:ring-destructive/30")}
              />
            )}

            {field.type === 'select' && (
              <Select
                value={formData[field.id] || ''}
                onValueChange={(val) => { if (val) handleInputChange(field.id, val) }}
              >
                <SelectTrigger className={cn("bg-background/80 cursor-pointer w-full", error && "border-destructive")}>
                  <SelectValue placeholder="Choose an option..." />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((opt) => (
                    <SelectItem key={opt} value={opt} className="cursor-pointer">
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {error && (
              <p className="text-xs font-semibold text-destructive animate-in fade-in duration-200">
                {error}
              </p>
            )}
          </div>
        )
      })}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-none gap-2 mt-4"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting application...
          </>
        ) : (
          <>
            Submit Application
            <SendHorizontal className="h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  )
}
