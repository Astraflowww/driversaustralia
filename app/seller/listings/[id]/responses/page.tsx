import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { ArrowLeft, Mail, Calendar, User, FileText, Download } from 'lucide-react'

export const revalidate = 0

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ListingResponsesPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Get current user session
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch listing details and check ownership
  const { data: listing } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .single()

  if (!listing) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          Listing not found.
        </div>
      </div>
    )
  }

  if (listing.seller_id !== user.id) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          Unauthorized: You do not own this listing.
        </div>
      </div>
    )
  }

  // Fetch responses with buyer profiles
  const { data: responsesData } = await supabase
    .from('responses')
    .select(`
      id,
      listing_id,
      buyer_id,
      form_data,
      submitted_at,
      profiles (
        email,
        full_name
      )
    `)
    .eq('listing_id', id)
    .order('submitted_at', { ascending: false })

  const responses = (responsesData as any[]) || []

  const schema = listing.form_schema as Array<{
    id: string
    label: string
    type: string
    required: boolean
  }>

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Back navigation */}
      <div>
        <Link href="/seller/dashboard" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <span className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-xs font-semibold text-primary capitalize mb-2">
            {listing.category}
          </span>
          <h1 className="text-3xl font-bold tracking-tight">{listing.title}</h1>
          <p className="text-muted-foreground mt-1">
            Browse buyer responses and dynamically filled out form details.
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-extrabold text-primary">{responses?.length || 0}</div>
          <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total Responses</div>
        </div>
      </div>

      {/* Responses Render */}
      {responses.length === 0 ? (
        <Card className="border-dashed border-2 flex flex-col items-center justify-center p-12 text-center bg-background/50">
          <FileText className="h-10 w-10 text-muted-foreground/60 mb-4" />
          <CardTitle className="text-lg font-medium">No responses yet</CardTitle>
          <CardDescription className="mt-1">
            Applications submitted by buyers will appear here in real time.
          </CardDescription>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Desktop Table View */}
          <div className="hidden md:block rounded-xl border border-border/50 bg-background/50 backdrop-blur-md overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="font-semibold text-muted-foreground py-4">Submitted At</TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4">Buyer Account</TableHead>
                  {schema.map((field) => (
                    <TableHead key={field.id} className="font-semibold text-muted-foreground py-4">
                      {field.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {responses.map((resp) => {
                  const buyerProfile = resp.profiles as any
                  const formData = resp.form_data as Record<string, any>

                  return (
                    <TableRow key={resp.id} className="hover:bg-muted/10 transition-colors">
                      <TableCell className="font-medium text-xs tabular-nums text-muted-foreground py-4">
                        {new Date(resp.submitted_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="py-4">
                        {buyerProfile ? (
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm">
                              {buyerProfile.full_name || 'Anonymous Buyer'}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {buyerProfile.email}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground italic">Guest</span>
                        )}
                      </TableCell>
                      {schema.map((field) => {
                        const val = formData?.[field.id]
                        return (
                          <TableCell key={field.id} className="text-sm py-4 max-w-xs truncate">
                            {val !== undefined && val !== null ? String(val) : (
                              <span className="text-muted-foreground/40 italic">-</span>
                            )}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card-based View */}
          <div className="grid gap-4 md:hidden">
            {responses.map((resp) => {
              const buyerProfile = resp.profiles as any
              const formData = resp.form_data as Record<string, any>

              return (
                <Card key={resp.id} className="border-border/50 bg-background/50 backdrop-blur-md shadow-sm">
                  <CardHeader className="bg-muted/10 border-b pb-3 pt-4 px-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{new Date(resp.submitted_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {buyerProfile ? (
                      <div className="flex items-center gap-2 mt-2">
                        <User className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-sm font-semibold">{buyerProfile.full_name || 'Anonymous Buyer'}</p>
                          <p className="text-[10px] text-muted-foreground">{buyerProfile.email}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic mt-2">Guest Applicant</p>
                    )}
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    {schema.map((field) => {
                      const val = formData?.[field.id]
                      return (
                        <div key={field.id} className="space-y-1">
                          <p className="text-[11px] uppercase font-bold tracking-wider text-muted-foreground">
                            {field.label}
                          </p>
                          <p className="text-sm text-foreground bg-muted/20 p-2 rounded border border-border/20">
                            {val !== undefined && val !== null ? String(val) : (
                              <span className="text-muted-foreground/40 italic">-</span>
                            )}
                          </p>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
