'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Trash, Eye, Settings, Coins, Loader2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface DynamicField {
  id: string
  label: string
  type: 'text' | 'textarea' | 'tel' | 'select'
  required: boolean
  options?: string[] // For select fields
}

const CATEGORY_LABELS: Record<string, string> = {
  mc: 'Multi Combination (MC)',
  hc: 'Heavy Combination (HC)',
  hr: 'Heavy Rigid (HR)',
  mr: 'Medium Rigid (MR)',
  lr: 'Light Rigid (LR)',
  car: 'Car Licence (C)',
  other: 'Other / Specialized',
}

const FIELD_TYPE_LABELS: Record<string, string> = {
  text: 'Text Input',
  textarea: 'Textarea (Multiline)',
  tel: 'Telephone Number',
  select: 'Dropdown Menu',
}

interface ListingFormProps {
  initialTokens: number
  userId: string
}

export function ListingForm({ initialTokens, userId }: ListingFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')

  // Basic Details
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('mc')

  // Dynamic Fields
  const [fields, setFields] = useState<DynamicField[]>([
    { id: 'name', label: 'Full Name', type: 'text', required: true },
    { id: 'phone', label: 'Phone Number', type: 'tel', required: true }
  ])

  // Helper states for adding fields
  const [newFieldLabel, setNewFieldLabel] = useState('')
  const [newFieldType, setNewFieldType] = useState<'text' | 'textarea' | 'tel' | 'select'>('text')
  const [newFieldRequired, setNewFieldRequired] = useState(true)
  const [newFieldSelectOptions, setNewFieldSelectOptions] = useState('')

  const handleAddField = () => {
    if (!newFieldLabel.trim()) return

    const id = newFieldLabel
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/(^_+| font-_+$)/g, '')

    // Check if ID already exists
    if (fields.some(f => f.id === id)) {
      setError('A field with a similar label already exists. Please choose a different label.')
      return
    }

    const field: DynamicField = {
      id,
      label: newFieldLabel.trim(),
      type: newFieldType,
      required: newFieldRequired,
      options: newFieldType === 'select' 
        ? newFieldSelectOptions.split(',').map(s => s.trim()).filter(Boolean)
        : undefined
    }

    setFields([...fields, field])
    setNewFieldLabel('')
    setNewFieldRequired(true)
    setNewFieldSelectOptions('')
    setError(null)
  }

  const handleRemoveField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (initialTokens < 1) {
      setError('You have insufficient tokens to create a listing. Please request tokens from an admin.')
      return
    }

    if (!title.trim() || !category) {
      setError('Please provide a listing title and select a category.')
      return
    }

    if (fields.length === 0) {
      setError('Please add at least one response field for drivers to fill out.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category,
          form_schema: fields,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create listing.')
      }

      router.refresh()
      router.push('/seller/dashboard')
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Mobile/Tablet Tab Selector */}
      <div className="flex lg:hidden border border-border/40 bg-muted/20 rounded-lg p-1 gap-1 max-w-sm mx-auto">
        <button
          type="button"
          onClick={() => setActiveTab('edit')}
          className={cn(
            "flex-1 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 cursor-pointer text-center",
            activeTab === 'edit'
              ? "bg-foreground text-background shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Edit Form
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={cn(
            "flex-1 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 cursor-pointer text-center",
            activeTab === 'preview'
              ? "bg-foreground text-background shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Live Preview
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Configuration Form */}
        <form onSubmit={handleSubmit} className={cn("lg:col-span-7 space-y-6", activeTab !== 'edit' && "hidden lg:block")}>
        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3.5 text-sm text-destructive font-medium animate-in fade-in duration-200">
            {error}
          </div>
        )}

        {/* 1. Basic Info */}
        <Card className="border-border bg-card shadow-none rounded-lg">
          <CardHeader>
            <CardTitle className="text-lg font-medium tracking-tight flex items-center gap-2 text-foreground">
              <Settings className="h-5 w-5 text-foreground" />
              Listing Details
            </CardTitle>
            <CardDescription>Configure the basic information for your posting.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">Listing Title</Label>
              <Input
                id="title"
                placeholder="e.g. Seeking experienced Delivery Driver for weekend events"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="bg-background"
              />
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="category">Required Licence Class</Label>
                <Select value={category} onValueChange={(val) => { if (val) setCategory(val) }}>
                  <SelectTrigger className="w-full bg-background cursor-pointer">
                    <SelectValue placeholder="Select licence class">
                      {category ? (CATEGORY_LABELS[category] || category) : undefined}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem className="cursor-pointer" value="mc">Multi Combination (MC)</SelectItem>
                    <SelectItem className="cursor-pointer" value="hc">Heavy Combination (HC)</SelectItem>
                    <SelectItem className="cursor-pointer" value="hr">Heavy Rigid (HR)</SelectItem>
                    <SelectItem className="cursor-pointer" value="mr">Medium Rigid (MR)</SelectItem>
                    <SelectItem className="cursor-pointer" value="lr">Light Rigid (LR)</SelectItem>
                    <SelectItem className="cursor-pointer" value="car">Car Licence (C)</SelectItem>
                    <SelectItem className="cursor-pointer" value="other">Other / Specialized</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 flex flex-col justify-end">
                <div className="rounded-md border border-border bg-muted/30 p-2.5 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1.5 font-semibold">
                    <Coins className="h-4 w-4 text-fin-orange" /> Cost to post:
                  </span>
                  <span className="font-semibold text-foreground">1 Token</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe details, schedules, payments, and criteria..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="bg-background"
              />
            </div>
          </CardContent>
        </Card>

        {/* 2. Form Fields Builder */}
        <Card className="border-border bg-card shadow-none rounded-lg">
          <CardHeader>
            <CardTitle className="text-lg font-medium tracking-tight flex items-center gap-2 text-foreground">
              <Plus className="h-5 w-5 text-foreground" />
              Dynamic Response Form Builder
            </CardTitle>
            <CardDescription>Design the questions drivers will answer when applying.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Added Fields List */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Configured Form Fields</Label>
              {fields.length === 0 ? (
                <div className="text-center py-6 text-sm border-dashed border border-border/70 rounded-md text-muted-foreground bg-muted/10">
                  No response fields defined. Add questions below.
                </div>
              ) : (
                <div className="space-y-2">
                  {fields.map((field, idx) => (
                    <div 
                      key={field.id} 
                      className="flex items-center justify-between p-3 border border-border rounded-md bg-card text-sm group"
                    >
                      <div className="space-y-0.5">
                        <p className="font-semibold flex items-center gap-1.5">
                          {field.label}
                          {field.required && (
                            <span className="text-destructive font-bold text-xs">*</span>
                          )}
                        </p>
                        <p className="text-[10px] text-muted-foreground capitalize font-semibold">
                          Type: {field.type} 
                          {field.options && field.options.length > 0 && ` (${field.options.join(', ')})`}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveField(idx)}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer h-8 w-8 p-0"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Field Creator Tool */}
            <div className="rounded-md border border-border bg-muted/20 p-4 space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Add Question Field</h4>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="new-field-label">Field Label (Question)</Label>
                  <Input
                    id="new-field-label"
                    placeholder="e.g. Work Experience (years)"
                    value={newFieldLabel}
                    onChange={(e) => setNewFieldLabel(e.target.value)}
                    className="bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="new-field-type">Field Type</Label>
                  <Select 
                    value={newFieldType} 
                    onValueChange={(val: any) => setNewFieldType(val)}
                  >
                    <SelectTrigger className="w-full bg-background cursor-pointer">
                      <SelectValue>
                        {newFieldType ? (FIELD_TYPE_LABELS[newFieldType] || newFieldType) : undefined}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem className="cursor-pointer" value="text">Text Input</SelectItem>
                      <SelectItem className="cursor-pointer" value="textarea">Textarea (Multiline)</SelectItem>
                      <SelectItem className="cursor-pointer" value="tel">Telephone Number</SelectItem>
                      <SelectItem className="cursor-pointer" value="select">Dropdown Menu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {newFieldType === 'select' && (
                <div className="space-y-1.5 animate-in fade-in duration-200">
                  <Label htmlFor="new-field-options">Select Options (comma separated)</Label>
                  <Input
                    id="new-field-options"
                    placeholder="e.g. Yes, No, Maybe"
                    value={newFieldSelectOptions}
                    onChange={(e) => setNewFieldSelectOptions(e.target.value)}
                    className="bg-background"
                  />
                  <p className="text-[10px] text-muted-foreground">Provide drop-down choices separated by commas.</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer text-muted-foreground hover:text-foreground">
                  <input
                    type="checkbox"
                    checked={newFieldRequired}
                    onChange={(e) => setNewFieldRequired(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                  />
                  Mark as Required field
                </label>

                <Button
                  type="button"
                  onClick={handleAddField}
                  variant="outline"
                  size="sm"
                  className="cursor-pointer gap-1.5 border-border"
                >
                  <Plus className="h-4 w-4" />
                  Add Question
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link href="/seller/dashboard">
            <Button type="button" variant="outline" className="cursor-pointer border-border">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={loading || initialTokens < 1}
            className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-none gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Publish Listing
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Real-time Dynamic Preview Panel */}
      <div className={cn("lg:col-span-5 space-y-4", activeTab !== 'preview' && "hidden lg:block")}>
        <h2 className="text-xl font-medium tracking-tight flex items-center gap-2 text-foreground">
          <Eye className="h-5 w-5 text-foreground" />
          Driver View Live Preview
        </h2>
        
        <Card className="border-border bg-card shadow-none rounded-lg overflow-hidden sticky top-24">
          <div className="bg-muted/30 p-5 border-b border-border/40">
            <span className="text-[10px] uppercase font-semibold text-foreground tracking-wider px-2 py-0.5 rounded bg-muted border border-border/30">
              {category}
            </span>
            <h3 className="text-xl font-semibold mt-2 truncate text-foreground">
              {title || 'Untitled Listing Preview'}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
              {description || 'Provide a description to see it appear in the preview box here.'}
            </p>
          </div>
          
          <CardContent className="p-6 space-y-4">
            <h4 className="font-semibold text-sm text-foreground uppercase tracking-wider mb-2 border-b border-border/40 pb-1">
              Apply Form (Driver response)
            </h4>

            {fields.map((field) => (
              <div key={field.id} className="space-y-1.5">
                <Label className="flex items-center gap-1 font-semibold text-sm">
                  {field.label}
                  {field.required && <span className="text-destructive font-bold">*</span>}
                </Label>

                {field.type === 'text' && (
                  <Input disabled placeholder={`Enter your ${field.label.toLowerCase()}`} />
                )}
                {field.type === 'textarea' && (
                  <Textarea disabled placeholder={`Enter your ${field.label.toLowerCase()}`} rows={3} />
                )}
                {field.type === 'tel' && (
                  <Input type="tel" disabled placeholder="+1 (555) 000-0000" />
                )}
                {field.type === 'select' && (
                  <Select disabled>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose an option..." />
                    </SelectTrigger>
                  </Select>
                )}
              </div>
            ))}

            <Button type="button" disabled className="w-full mt-4 cursor-not-allowed">
              Submit Application
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  )
}
