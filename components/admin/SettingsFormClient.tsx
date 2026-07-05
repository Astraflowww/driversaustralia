'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Settings {
  signup_tokens: number
  listing_token_cost: number
  site_name: string
  support_email: string
  maintenance_mode: boolean
}

interface SettingsFormClientProps {
  initialSettings: Settings
}

export function SettingsFormClient({ initialSettings }: SettingsFormClientProps) {
  const router = useRouter()
  const [settings, setSettings] = useState<Settings>(initialSettings)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleChange = (key: keyof Settings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save settings.')
      }

      setMessage({ type: 'success', text: 'Settings saved successfully!' })
      router.refresh()
    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err.message || 'Something went wrong while saving settings.' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {message && (
        <div className={cn(
          "rounded-lg border p-4 flex items-start gap-3 text-sm animate-in fade-in duration-200",
          message.type === 'success' 
            ? "bg-green-50 border-green-200 text-green-800" 
            : "bg-red-50 border-red-200 text-red-800"
        )}>
          {message.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          )}
          <div>
            <p className="font-semibold">{message.type === 'success' ? 'Success' : 'Error saving settings'}</p>
            <p className="mt-0.5 text-xs opacity-90">{message.text}</p>
          </div>
        </div>
      )}

      {/* WordPress Classic Table-style Settings Form Grid */}
      <div className="border-t border-[#f5f1ec] pt-2 divide-y divide-[#f5f1ec] text-sm">
        
        {/* Site Title */}
        <div className="py-5 grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          <Label htmlFor="site_name" className="font-semibold text-[#111111] md:pt-2">
            Site Name
          </Label>
          <div className="md:col-span-3 space-y-1.5">
            <Input
              id="site_name"
              type="text"
              value={settings.site_name}
              onChange={(e) => handleChange('site_name', e.target.value)}
              className="max-w-md border-[#d3cec6]"
              required
            />
            <p className="text-xs text-[#626260]">The title/name used across the website interfaces and headers.</p>
          </div>
        </div>

        {/* Support Email */}
        <div className="py-5 grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          <Label htmlFor="support_email" className="font-semibold text-[#111111] md:pt-2">
            Support Email Address
          </Label>
          <div className="md:col-span-3 space-y-1.5">
            <Input
              id="support_email"
              type="email"
              value={settings.support_email}
              onChange={(e) => handleChange('support_email', e.target.value)}
              className="max-w-md border-[#d3cec6]"
              required
            />
            <p className="text-xs text-[#626260]">This address is used for support notifications, contact forms, and email replies.</p>
          </div>
        </div>

        {/* Default Registration Tokens */}
        <div className="py-5 grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          <Label htmlFor="signup_tokens" className="font-semibold text-[#111111] md:pt-2">
            Default Seller Signup Credits
          </Label>
          <div className="md:col-span-3 space-y-1.5">
            <Input
              id="signup_tokens"
              type="number"
              min="0"
              value={settings.signup_tokens}
              onChange={(e) => handleChange('signup_tokens', parseInt(e.target.value, 10) || 0)}
              className="max-w-xs border-[#d3cec6]"
              required
            />
            <p className="text-xs text-[#626260]">Number of initial free tokens automatically credited to business owner accounts upon registration.</p>
          </div>
        </div>

        {/* Listing Token Cost */}
        <div className="py-5 grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          <Label htmlFor="listing_token_cost" className="font-semibold text-[#111111] md:pt-2">
            Listing Posting Cost
          </Label>
          <div className="md:col-span-3 space-y-1.5">
            <Input
              id="listing_token_cost"
              type="number"
              min="0"
              value={settings.listing_token_cost}
              onChange={(e) => handleChange('listing_token_cost', parseInt(e.target.value, 10) || 0)}
              className="max-w-xs border-[#d3cec6]"
              required
            />
            <p className="text-xs text-[#626260]">Number of tokens deducted from a seller's balance to publish a listing posting.</p>
          </div>
        </div>

        {/* Maintenance Mode */}
        <div className="py-5 grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          <Label className="font-semibold text-[#111111]">
            System Maintenance Mode
          </Label>
          <div className="md:col-span-3 space-y-2">
            <div className="flex items-center gap-2">
              <input
                id="maintenance_mode"
                type="checkbox"
                checked={settings.maintenance_mode}
                onChange={(e) => handleChange('maintenance_mode', e.target.checked)}
                className="h-4.5 w-4.5 text-[#f0a500] border-[#d3cec6] rounded focus:ring-[#f0a500] cursor-pointer"
              />
              <label htmlFor="maintenance_mode" className="text-sm text-[#111111] font-medium select-none cursor-pointer">
                Enable Maintenance Mode
              </label>
            </div>
            <p className="text-xs text-[#626260] max-w-xl leading-relaxed">
              When checked, public listing creation will be locked. Sellers will receive a notice to check back later. This allows safe administrative updates.
            </p>
          </div>
        </div>

      </div>

      {/* Form Submit Footer */}
      <div className="pt-4 border-t border-[#f5f1ec] flex items-center gap-4">
        <Button 
          type="submit" 
          disabled={loading}
          className="cursor-pointer bg-[#111111] hover:bg-[#111111]/90 text-white font-semibold shadow-none px-6"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Settings...
            </>
          ) : (
            'Save Settings Changes'
          )}
        </Button>
      </div>
    </form>
  )
}
