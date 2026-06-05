'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
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
import { Search, Coins, Plus, Minus, UserCog, Loader2 } from 'lucide-react'
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
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  // Modal State
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null)
  const [open, setOpen] = useState(false)
  const [action, setAction] = useState<'add' | 'remove'>('add')
  const [amount, setAmount] = useState('5')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  const handleAdjustTokens = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return

    const deltaAmount = parseInt(amount, 10)
    if (isNaN(deltaAmount) || deltaAmount <= 0) {
      setError('Please provide a valid token amount greater than zero.')
      return
    }

    const delta = action === 'add' ? deltaAmount : -deltaAmount

    // Check if lowering below 0
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

  return (
    <div className="space-y-6">
      {/* Controls: Search and Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background/50"
          />
        </div>
        <div className="flex items-center gap-3">
          <Label className="text-sm font-semibold shrink-0">Filter Role:</Label>
          <Select value={roleFilter} onValueChange={(val) => { if (val) setRoleFilter(val) }}>
            <SelectTrigger className="w-[150px] bg-background/50 cursor-pointer">
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
      <div className="hidden md:block rounded-lg border border-border bg-card overflow-x-auto shadow-none">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="font-medium text-muted-foreground py-4">User Details</TableHead>
              <TableHead className="font-medium text-muted-foreground py-4">System Role</TableHead>
              <TableHead className="font-medium text-muted-foreground py-4">Token Balance</TableHead>
              <TableHead className="font-medium text-muted-foreground py-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground text-sm">
                  No users found matching filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/10 transition-colors">
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">
                        {user.full_name || 'No Name Provided'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className={cn(
                      "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold capitalize",
                      user.role === 'admin'
                        ? "bg-[#ff2067]/10 text-[#cc0044] border-[#ff2067]/20"
                        : user.role === 'seller'
                        ? "bg-fin-orange/10 text-fin-orange border-fin-orange/20"
                        : "bg-muted text-muted-foreground border-border"
                    )}>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    {user.role === 'seller' ? (
                      <TokenBadge tokens={user.tokens} />
                    ) : (
                      <span className="text-xs text-muted-foreground/60 italic">N/A (Non-Business Owner)</span>
                    )}
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    {user.role === 'seller' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenDialog(user)}
                        className="cursor-pointer gap-1.5"
                      >
                        <UserCog className="h-4 w-4" />
                        Manage Credits
                      </Button>
                    )}
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
          <div className="text-center py-8 rounded-lg border border-border bg-card text-muted-foreground text-sm">
            No users found matching filters.
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div 
              key={user.id} 
              className="rounded-lg border border-border bg-card p-5 space-y-4 shadow-none"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col text-left">
                  <span className="font-semibold text-sm text-foreground">
                    {user.full_name || 'No Name Provided'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
                <span className={cn(
                  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold capitalize shrink-0",
                  user.role === 'admin'
                    ? "bg-[#ff2067]/10 text-[#cc0044] border-[#ff2067]/20"
                    : user.role === 'seller'
                    ? "bg-fin-orange/10 text-fin-orange border-fin-orange/20"
                    : "bg-muted text-muted-foreground border-border"
                )}>
                  {user.role}
                </span>
              </div>

              <div className="border-t border-border/40 pt-3 flex items-center justify-between gap-4">
                <div className="flex flex-col text-left">
                  <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Token Balance</span>
                  {user.role === 'seller' ? (
                    <TokenBadge tokens={user.tokens} />
                  ) : (
                    <span className="text-xs text-muted-foreground/60 italic">N/A (Non-Business Owner)</span>
                  )}
                </div>

                {user.role === 'seller' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenDialog(user)}
                    className="cursor-pointer gap-1.5 h-9 text-xs"
                  >
                    <UserCog className="h-4 w-4" />
                    Manage Credits
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Adjust Tokens Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-medium">
              <Coins className="h-5 w-5 text-fin-orange" />
              Adjust Token Balance
            </DialogTitle>
            <DialogDescription>
              Add or remove listing credits for <span className="font-semibold">{selectedUser?.full_name || selectedUser?.email}</span>.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleAdjustTokens} className="space-y-4">
            <div className="space-y-3">
              <Label className="text-xs uppercase font-semibold text-muted-foreground">Operation Action</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={action === 'add' ? 'default' : 'outline'}
                  onClick={() => setAction('add')}
                  className={cn("cursor-pointer gap-1.5 font-semibold", action === 'add' && "bg-primary text-primary-foreground hover:bg-primary/95")}
                >
                  <Plus className="h-4 w-4" /> Add Tokens
                </Button>
                <Button
                  type="button"
                  variant={action === 'remove' ? 'default' : 'outline'}
                  onClick={() => setAction('remove')}
                  className={cn("cursor-pointer gap-1.5 font-semibold", action === 'remove' && "bg-destructive text-destructive-foreground hover:bg-destructive/90")}
                >
                  <Minus className="h-4 w-4" /> Remove Tokens
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="current-balance">Current Balance</Label>
                <Input
                  id="current-balance"
                  disabled
                  value={`${selectedUser?.tokens || 0} Tokens`}
                  className="bg-muted"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="token-amount">Adjust Amount</Label>
                <Input
                  id="token-amount"
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="adjust-reason">Audit Reason</Label>
              <Input
                id="adjust-reason"
                placeholder="e.g. Compensation for service delay"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
              <p className="text-[10px] text-muted-foreground">Explain why this balance adjustment is occurring.</p>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className={cn(
                  "cursor-pointer shadow-none",
                  action === 'add' 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                    : "bg-destructive hover:bg-destructive/90 text-white"
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
    </div>
  )
}
