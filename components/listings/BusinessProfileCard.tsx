'use client'

import React, { useState } from 'react'
import { Building2, Phone, FileText, MapPin, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BusinessProfileForm } from './BusinessProfileForm'

interface Profile {
  id: string
  full_name: string | null
  business_name: string | null
  business_phone: string | null
  abn: string | null
  business_address: string | null
}

interface BusinessProfileCardProps {
  profile: Profile
}

export function BusinessProfileCard({ profile }: BusinessProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false)

  const hasBusinessDetails = !!(
    profile.business_name &&
    profile.business_phone &&
    profile.abn &&
    profile.business_address
  )

  if (isEditing) {
    return (
      <div className="space-y-4 animate-in fade-in duration-200">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Update Profile
          </h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsEditing(false)}
            className="cursor-pointer text-xs"
          >
            Cancel
          </Button>
        </div>
        <BusinessProfileForm 
          initialProfile={profile} 
          onSuccess={() => setIsEditing(false)} 
        />
      </div>
    )
  }

  return (
    <Card className="border-border bg-card shadow-none rounded-lg overflow-hidden animate-in fade-in duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Business Profile
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsEditing(true)}
            className="cursor-pointer h-7 w-7 p-0"
            title="Edit Profile"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
        </div>
        <CardDescription>Your registered organization details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {!hasBusinessDetails ? (
          <div className="rounded-md border border-dashed border-amber-500/40 bg-amber-500/5 p-4 text-center">
            <Building2 className="h-8 w-8 text-amber-600 mx-auto mb-2 opacity-80" />
            <p className="font-semibold text-amber-800 text-xs">Incomplete Profile</p>
            <p className="text-[11px] text-amber-700 mt-1 mb-3">
              Configure your details to enable job listings creation.
            </p>
            <Button 
              size="sm" 
              onClick={() => setIsEditing(true)}
              className="cursor-pointer text-xs w-full"
            >
              Configure Now
            </Button>
          </div>
        ) : (
          <div className="space-y-3.5">
            <div className="flex items-start gap-2.5">
              <Building2 className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block leading-none">
                  Company Name
                </span>
                <span className="font-medium text-foreground">{profile.business_name}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Phone className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block leading-none">
                  Phone
                </span>
                <span className="font-medium text-foreground">{profile.business_phone}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block leading-none">
                  ABN / Registration
                </span>
                <span className="font-medium text-foreground tabular-nums">{profile.abn}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block leading-none">
                  Headquarters
                </span>
                <span className="font-medium text-foreground leading-normal block max-w-[200px]">
                  {profile.business_address}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
