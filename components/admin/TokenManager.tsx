'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TokenBadge } from '@/components/shared/TokenBadge'
import { Search, Coins, Plus, Minus, UserCog, Loader2, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const roleFilterLabels: Record<string, string> = {
  all: 'All Roles',
  seller: 'Business Owners Only',
  buyer: 'Drivers Only',
  admin: 'Admins Only',
}

interface Profile {
  id: string
  email: string
  full_name: string | null
  role: 'buyer' | 'seller' | 'admin'
  tokens: number
  created_at: string
}

interface TokenManagerProps {
  users: Profile[]
  currentAdminId: string
}

export function TokenManager({ users, currentAdminId }: TokenManagerProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialSearch = searchParams.get('search') || ''
  
  const [search, setSearch] = useState(initialSearch)
  const [roleFilter, setRoleFilter] = useState('all')

  // Token adjustment modal state
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null)
  const [open, setOpen] = useState(false)
  const [action, setAction] = useState<'add' | 'remove'>('add')
  const [amount, setAmount] = useState('5')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Role change modal state
  const [roleOpen, setRoleOpen] = useState(false)
  const [targetRoleUser, setTargetRoleUser] = useState<Profile | null>(null)
  const [newRole, setNewRole] = useState<'buyer' | 'seller' | 'admin'>('buyer')
  const [roleLoading, setRoleLoading] = useState(false)

  // Delete user modal state
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [targetDeleteUser, setTargetDeleteUser] = useState<Profile | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Update search input if URL search param changes
  useEffect(() => {
    if (initialSearch) {
      setSearch(initialSearch)
    }
  }, [initialSearch])

  // Filter users list
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        (user.full_name || '').toLowerCase().includes(search.toLowerCase())
      
      const matchesRole = roleFilter === 'all' || user.role === roleFilter

      return matchesSearch && matchesRole
    })
  }, [users, search, roleFilter])

  const handleOpenDialog = (user: Profile) => {
    setSelectedUser(user)
    setAmount('5')
    setReason('')
    setAction('add')
    setError(null)
    setOpen(true)
  }

  // API handler: adjust credits/tokens
  const handleAdjustTokens = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return

    const deltaAmount = parseInt(amount, 10)
    if (isNaN(deltaAmount) || deltaAmount <= 0) {
      setError('Please provide a valid token amount greater than zero.')
      return
    }

    const delta = action === 'add' ? deltaAmount : -deltaAmount

    if (selectedUser.tokens + delta < 0) {
      setError(`Cannot remove ${deltaAmount} tokens. User only has ${selectedUser.tokens} tokens left.`)
      return
    }

    if (!reason.trim()) {
      setError('Please provide a reason for the adjustment.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/tokens', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target_user_id: selectedUser.id,
          token_delta: delta,
          reason: reason.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to adjust tokens.')
      }

      setOpen(false)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // API handler: change user role
  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!targetRoleUser) return

    setRoleLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/admin/users/${targetRoleUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update user role.')
      }

      setRoleOpen(false)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setRoleLoading(false)
    }
  }

  // API handler: delete user account
  const handleDeleteUser = async () => {
    if (!targetDeleteUser) return

    setDeleteLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/admin/users/${targetDeleteUser.id}`, {
        method: 'DELETE',
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete user.')
      }

      setDeleteOpen(false)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && !open && !roleOpen && !deleteOpen && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3.5 text-sm text-destructive font-semibold">
          {error}
        </div>
      )}

      {/* Controls: Search and Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-[#f5f1ec]/50 border-[#d3cec6]"
          />
        </div>
        <div className="flex items-center gap-3">
          <Label className="text-sm font-semibold shrink-0">Filter Role:</Label>
          <Select value={roleFilter} onValueChange={(val) => { if (val) setRoleFilter(val) }}>
            <SelectTrigger className="w-[180px] bg-[#f5f1ec]/50 border-[#d3cec6] cursor-pointer">
              <SelectValue>
                {roleFilter ? (roleFilterLabels[roleFilter] || roleFilter) : undefined}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="cursor-pointer" value="all">All Roles</SelectItem>
              <SelectItem className="cursor-pointer" value="seller">Business Owners Only</SelectItem>
              <SelectItem className="cursor-pointer" value="buyer">Drivers Only</SelectItem>
              <SelectItem className="cursor-pointer" value="admin">Admins Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Users Table - Desktop View */}
      <div className="hidden md:block rounded-xl border border-[#d3cec6] bg-white overflow-x-auto shadow-sm">
        <Table>
          <TableHeader className="bg-neutral-50/70 border-b border-[#d3cec6]">
            <TableRow>
              <TableHead className="font-semibold text-[#111111] py-4">User Details</TableHead>
              <TableHead className="font-semibold text-[#111111] py-4">System Role</TableHead>
              <TableHead className="font-semibold text-[#111111] py-4">Token Balance</TableHead>
              <TableHead className="font-semibold text-[#111111] py-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground text-sm">
                  No users found matching filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-neutral-50/50 transition-colors">
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-[#111111]">
                        {user.full_name || 'No Name Provided'}
                      </span>
                      <span className="text-xs text-[#626260]">
                        {user.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className={cn(
                      "inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold capitalize border",
                      user.role === 'admin'
                        ? "bg-[#ff2067]/10 text-[#cc0044] border-[#ff2067]/20"
                        : user.role === 'seller'
                        ? "bg-amber-100 text-[#a05000] border-amber-200"
                        : "bg-neutral-100 text-neutral-600 border-neutral-200"
                    )}>
                      {user.role === 'seller' ? 'Business Owner' : user.role === 'buyer' ? 'Driver' : user.role}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    {user.role === 'seller' ? (
                      <TokenBadge tokens={user.tokens} />
                    ) : (
                      <span className="text-xs text-neutral-400 italic">N/A (Non-Seller)</span>
                    )}
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {user.role === 'seller' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenDialog(user)}
                          className="cursor-pointer gap-1 h-8 text-xs font-semibold border-[#d3cec6]"
                        >
                          <Coins className="h-3.5 w-3.5 text-[#f0a500]" />
                          Manage Credits
                        </Button>
                      )}
                      
                      {user.id !== currentAdminId && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setTargetRoleUser(user)
                              setNewRole(user.role)
                              setRoleOpen(true)
                              setError(null)
                            }}
                            className="cursor-pointer gap-1 h-8 text-xs font-semibold border-[#d3cec6]"
                          >
                            <UserCog className="h-3.5 w-3.5 text-blue-500" />
                            Role
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setTargetDeleteUser(user)
                              setDeleteOpen(true)
                              setError(null)
                            }}
                            className="cursor-pointer gap-1 h-8 text-xs font-semibold bg-red-50 hover:bg-red-600 hover:text-white text-red-600 border-red-100"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Users Cards - Mobile View */}
      <div className="grid gap-4 md:hidden">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-10 rounded-xl border border-[#d3cec6] bg-white text-muted-foreground text-sm">
            No users found matching filters.
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div 
              key={user.id} 
              className="rounded-xl border border-[#d3cec6] bg-white p-5 space-y-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col text-left">
                  <span className="font-bold text-sm text-[#111111]">
                    {user.full_name || 'No Name Provided'}
                  </span>
                  <span className="text-xs text-[#626260]">
                    {user.email}
                  </span>
                </div>
                <span className={cn(
                  "inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold capitalize border shrink-0",
                  user.role === 'admin'
                    ? "bg-[#ff2067]/10 text-[#cc0044] border-[#ff2067]/20"
                    : user.role === 'seller'
                    ? "bg-amber-100 text-[#a05000] border-amber-200"
                    : "bg-neutral-100 text-neutral-600 border-neutral-200"
                )}>
                  {user.role === 'seller' ? 'Business Owner' : user.role === 'buyer' ? 'Driver' : user.role}
                </span>
              </div>

              <div className="border-t border-[#f5f1ec] pt-3 flex items-center justify-between gap-4">
                <div className="flex flex-col text-left">
                  <span className="text-[9px] text-[#626260] uppercase font-bold tracking-wider mb-0.5">Token Balance</span>
                  {user.role === 'seller' ? (
                    <TokenBadge tokens={user.tokens} />
                  ) : (
                    <span className="text-xs text-neutral-400 italic">N/A</span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {user.role === 'seller' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenDialog(user)}
                      className="cursor-pointer h-8 text-[11px] font-semibold border-[#d3cec6]"
                    >
                      Credits
                    </Button>
                  )}
                  {user.id !== currentAdminId && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setTargetRoleUser(user)
                          setNewRole(user.role)
                          setRoleOpen(true)
                          setError(null)
                        }}
                        className="cursor-pointer h-8 text-[11px] font-semibold border-[#d3cec6]"
                      >
                        Role
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setTargetDeleteUser(user)
                          setDeleteOpen(true)
                          setError(null)
                        }}
                        className="cursor-pointer h-8 text-[11px] font-semibold bg-red-50 text-red-600 border-red-100"
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 1. Adjust Tokens Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md bg-white border-[#d3cec6]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-medium text-[#111111]">
              <Coins className="h-5 w-5 text-[#f0a500]" />
              Adjust Token Balance
            </DialogTitle>
            <DialogDescription className="text-xs text-[#626260]">
              Add or remove listing credits for <span className="font-semibold text-[#111111]">{selectedUser?.full_name || selectedUser?.email}</span>.
            </DialogDescription>
          </DialogHeader>

          {error && open && (
            <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleAdjustTokens} className="space-y-4">
            <div className="space-y-3">
              <Label className="text-[10px] uppercase font-bold tracking-wider text-[#626260]">Operation Action</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={action === 'add' ? 'default' : 'outline'}
                  onClick={() => setAction('add')}
                  className={cn("cursor-pointer gap-1.5 font-semibold text-xs h-9 border-[#d3cec6]", action === 'add' && "bg-[#111111] text-white hover:bg-[#111111]/90")}
                >
                  <Plus className="h-3.5 w-3.5" /> Add Tokens
                </Button>
                <Button
                  type="button"
                  variant={action === 'remove' ? 'default' : 'outline'}
                  onClick={() => setAction('remove')}
                  className={cn("cursor-pointer gap-1.5 font-semibold text-xs h-9 border-[#d3cec6]", action === 'remove' && "bg-[#c41c1c] text-white hover:bg-[#c41c1c]/90")}
                >
                  <Minus className="h-3.5 w-3.5" /> Remove Tokens
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="current-balance" className="text-xs text-[#111111]">Current Balance</Label>
                <Input
                  id="current-balance"
                  disabled
                  value={`${selectedUser?.tokens || 0} Tokens`}
                  className="bg-neutral-50 border-[#d3cec6] text-[#111111] font-semibold text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="token-amount" className="text-xs text-[#111111]">Adjust Amount</Label>
                <Input
                  id="token-amount"
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="border-[#d3cec6]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="adjust-reason" className="text-xs text-[#111111]">Audit Reason</Label>
              <Input
                id="adjust-reason"
                placeholder="e.g. Purchased posting package"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="border-[#d3cec6]"
                required
              />
              <p className="text-[10px] text-neutral-400">Explain why this balance adjustment is occurring.</p>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="cursor-pointer border-[#d3cec6]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className={cn(
                  "cursor-pointer shadow-none font-semibold text-white",
                  action === 'add' 
                    ? "bg-[#111111] hover:bg-[#111111]/90" 
                    : "bg-[#c41c1c] hover:bg-[#c41c1c]/90"
                )}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Apply Adjustment'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2. Change Role Dialog */}
      <Dialog open={roleOpen} onOpenChange={setRoleOpen}>
        <DialogContent className="sm:max-w-md bg-white border-[#d3cec6]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-medium text-[#111111]">
              <UserCog className="h-5 w-5 text-blue-500" />
              Manage System Role
            </DialogTitle>
            <DialogDescription className="text-xs text-[#626260]">
              Promote or demote <span className="font-semibold text-[#111111]">{targetRoleUser?.full_name || targetRoleUser?.email}</span>.
            </DialogDescription>
          </DialogHeader>

          {error && roleOpen && (
            <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleUpdateRole} className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="select-role" className="text-xs text-[#111111]">Assign System Role</Label>
              <Select 
                value={newRole} 
                onValueChange={(val) => { if (val) setNewRole(val as any) }}
              >
                <SelectTrigger id="select-role" className="w-full bg-white border-[#d3cec6] cursor-pointer">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buyer">Driver (Buyer)</SelectItem>
                  <SelectItem value="seller">Business Owner (Seller)</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[10px] text-neutral-400 leading-relaxed">
                Important: Business Owners can purchase tokens and post listings. Drivers can view dynamic forms and respond. Admins control listings moderation.
              </p>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setRoleOpen(false)}
                className="cursor-pointer border-[#d3cec6]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={roleLoading}
                className="cursor-pointer bg-[#111111] hover:bg-[#111111]/90 text-white font-semibold shadow-none"
              >
                {roleLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Change Role'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 3. Delete User Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md bg-white border-[#d3cec6]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-medium text-[#c41c1c]">
              <Trash2 className="h-5 w-5" />
              Confirm Account Deletion
            </DialogTitle>
            <DialogDescription className="text-xs text-[#626260]">
              Are you absolutely sure you want to delete <span className="font-semibold text-[#111111]">{targetDeleteUser?.full_name || targetDeleteUser?.email}</span>?
            </DialogDescription>
          </DialogHeader>

          {error && deleteOpen && (
            <div className="rounded-md bg-[#c41c1c]/10 border border-[#c41c1c]/20 p-3 text-xs text-[#c41c1c] font-semibold">
              {error}
            </div>
          )}

          <div className="bg-[#c41c1c]/5 border border-[#c41c1c]/20 p-3.5 rounded-lg text-xs text-[#c41c1c] leading-relaxed">
            <strong>Warning:</strong> Deleting this account will permanently delete their authentication profile, personal settings, listings, and buyer responses. This action is irreversible.
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              className="cursor-pointer border-[#d3cec6]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDeleteUser}
              disabled={deleteLoading}
              className="cursor-pointer bg-[#c41c1c] hover:bg-[#c41c1c]/90 text-white font-semibold shadow-none"
            >
              {deleteLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin animate-spin-fast" />
                  Deleting...
                </>
              ) : (
                'Permanently Delete Account'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
