'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { 
  Check, 
  X, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Loader2,
  FileSpreadsheet
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

const statusLabels: Record<string, string> = {
  all: 'All Postings',
  pending: 'Pending Moderation',
  approved: 'Approved Listings',
  rejected: 'Rejected Listings',
}

interface Listing {
  id: string
  title: string
  description: string | null
  category: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  profiles?: {
    full_name: string | null
    email: string
  }
}

interface ListingApprovalTableProps {
  initialListings: Listing[]
}

export function ListingApprovalTable({ initialListings }: ListingApprovalTableProps) {
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useState<string>('pending')
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleUpdateStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
    setLoadingId(id)
    setError(null)

    try {
      const res = await fetch(`/api/listings/${id}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update listing status.')
      }

      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoadingId(null)
    }
  }

  // Filter listings based on selected status
  const filteredListings = initialListings.filter((listing) => {
    if (statusFilter === 'all') return true
    return listing.status === statusFilter
  })

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Label className="text-sm font-semibold shrink-0">Filter Status:</Label>
          <Select value={statusFilter} onValueChange={(val) => { if (val) setStatusFilter(val) }}>
            <SelectTrigger className="w-[180px] bg-background/50 cursor-pointer">
              <SelectValue>
                {statusFilter ? (statusLabels[statusFilter] || statusFilter) : undefined}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="cursor-pointer" value="all">All Postings</SelectItem>
              <SelectItem className="cursor-pointer" value="pending">Pending Moderation</SelectItem>
              <SelectItem className="cursor-pointer" value="approved">Approved Listings</SelectItem>
              <SelectItem className="cursor-pointer" value="rejected">Rejected Listings</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3.5 text-sm text-destructive font-medium animate-in fade-in duration-200">
          {error}
        </div>
      )}

      {/* Listings Table - Desktop View */}
      <div className="hidden md:block rounded-xl border border-border/50 bg-background/50 backdrop-blur-md overflow-x-auto shadow-sm">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="font-semibold text-muted-foreground py-4">Listing Details</TableHead>
              <TableHead className="font-semibold text-muted-foreground py-4">Business Owner Details</TableHead>
              <TableHead className="font-semibold text-muted-foreground py-4">Current Status</TableHead>
              <TableHead className="font-semibold text-muted-foreground py-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredListings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground text-sm">
                  No listings found in this category.
                </TableCell>
              </TableRow>
            ) : (
              filteredListings.map((listing) => {
                const seller = listing.profiles
                const isLoading = loadingId === listing.id

                return (
                  <TableRow key={listing.id} className="hover:bg-muted/10 transition-colors">
                    {/* Details Column */}
                    <TableCell className="py-4 max-w-sm">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground capitalize">
                            {listing.category}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(listing.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-foreground line-clamp-1">{listing.title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {listing.description || 'No description provided.'}
                        </p>
                      </div>
                    </TableCell>

                    {/* Seller Column */}
                    <TableCell className="py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">
                          {seller?.full_name || 'Anonymous'}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {seller?.email}
                        </span>
                      </div>
                    </TableCell>

                    {/* Status Column */}
                    <TableCell className="py-4">
                      {listing.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 border border-green-500/20 px-2.5 py-0.5 text-xs font-semibold text-green-600 dark:text-green-400">
                          <CheckCircle className="h-3 w-3" />
                          Approved
                        </span>
                      )}
                      {listing.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                          <Clock className="h-3 w-3" />
                          Pending
                        </span>
                      )}
                      {listing.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 border border-destructive/20 px-2.5 py-0.5 text-xs font-semibold text-destructive">
                          <XCircle className="h-3 w-3" />
                          Rejected
                        </span>
                      )}
                    </TableCell>

                    {/* Actions Column */}
                    <TableCell className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* View live preview link */}
                        <a href={`/listings/${listing.id}`} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="icon-sm" className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer" title="Preview Listing Form">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </a>

                        {listing.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStatus(listing.id, 'approved')}
                              disabled={isLoading}
                              className="bg-green-500/10 hover:bg-green-500 hover:text-white text-green-600 border-green-500/20 dark:text-green-400 h-8 px-2.5 cursor-pointer font-semibold"
                            >
                              {isLoading ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Check className="h-3.5 w-3.5" />
                              )}
                              Approve
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStatus(listing.id, 'rejected')}
                              disabled={isLoading}
                              className="bg-destructive/10 hover:bg-destructive hover:text-white text-destructive border-destructive/20 h-8 px-2.5 cursor-pointer font-semibold"
                            >
                              {isLoading ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <X className="h-3.5 w-3.5" />
                              )}
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Listings Cards - Mobile View */}
      <div className="grid gap-4 md:hidden">
        {filteredListings.length === 0 ? (
          <div className="text-center py-10 rounded-xl border border-border/50 bg-background/50 backdrop-blur-md text-muted-foreground text-sm">
            No listings found in this category.
          </div>
        ) : (
          filteredListings.map((listing) => {
            const seller = listing.profiles
            const isLoading = loadingId === listing.id

            return (
              <div 
                key={listing.id} 
                className="rounded-xl border border-border/50 bg-background/50 backdrop-blur-md p-5 space-y-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground capitalize">
                        {listing.category}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(listing.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-foreground">{listing.title}</h4>
                  </div>
                  <div>
                    {listing.status === 'approved' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 border border-green-500/20 px-2.5 py-0.5 text-xs font-semibold text-green-600 dark:text-green-400">
                        <CheckCircle className="h-3.5 w-3.5" />
                        Approved
                      </span>
                    )}
                    {listing.status === 'pending' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                        <Clock className="h-3.5 w-3.5" />
                        Pending
                      </span>
                    )}
                    {listing.status === 'rejected' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 border border-destructive/20 px-2.5 py-0.5 text-xs font-semibold text-destructive">
                        <XCircle className="h-3.5 w-3.5" />
                        Rejected
                      </span>
                    )}
                  </div>
                </div>

                {listing.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 bg-muted/20 p-2.5 rounded border border-border/20">
                    {listing.description}
                  </p>
                )}

                <div className="border-t border-border/30 pt-3 flex items-center justify-between gap-4">
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Business Owner</span>
                    <span className="font-semibold text-xs text-foreground truncate max-w-[120px]">
                      {seller?.full_name || 'Anonymous'}
                    </span>
                    <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                      {seller?.email}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <a href={`/listings/${listing.id}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon-sm" className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer" title="Preview Listing Form">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </a>

                    {listing.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(listing.id, 'approved')}
                          disabled={isLoading}
                          className="bg-green-500/10 hover:bg-green-500 hover:text-white text-green-600 border-green-500/20 dark:text-green-400 h-8 px-2 cursor-pointer font-semibold text-xs gap-1"
                        >
                          {isLoading ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )}
                          Approve
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(listing.id, 'rejected')}
                          disabled={isLoading}
                          className="bg-destructive/10 hover:bg-destructive hover:text-white text-destructive border-destructive/20 h-8 px-2 cursor-pointer font-semibold text-xs gap-1"
                        >
                          {isLoading ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <X className="h-3 w-3" />
                          )}
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
