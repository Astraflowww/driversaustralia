'use client'

import React, { useState, useMemo } from 'react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, ArrowUpDown, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Transaction {
  id: string
  user_id: string
  admin_id: string | null
  delta: number
  reason: string | null
  created_at: string
  user?: {
    email: string
    full_name: string | null
  } | null
  admin?: {
    email: string
    full_name: string | null
  } | null
}

interface TransactionsTableClientProps {
  initialTransactions: Transaction[]
}

export function TransactionsTableClient({ initialTransactions }: TransactionsTableClientProps) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  const filteredTransactions = useMemo(() => {
    return initialTransactions.filter((tx) => {
      const userEmail = tx.user?.email || ''
      const userName = tx.user?.full_name || ''
      const reasonText = tx.reason || ''
      
      const matchesSearch = 
        userEmail.toLowerCase().includes(search.toLowerCase()) ||
        userName.toLowerCase().includes(search.toLowerCase()) ||
        reasonText.toLowerCase().includes(search.toLowerCase())

      const matchesType = 
        typeFilter === 'all' ||
        (typeFilter === 'add' && tx.delta > 0) ||
        (typeFilter === 'remove' && tx.delta < 0)

      return matchesSearch && matchesType
    })
  }, [initialTransactions, search, typeFilter])

  return (
    <div className="space-y-6">
      {/* Controls: Search and Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by user name, email, or audit reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-[#f5f1ec]/50 border-[#d3cec6]"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <Label className="text-sm font-semibold shrink-0">Filter Type:</Label>
          <Select value={typeFilter} onValueChange={(val) => { if (val) setTypeFilter(val) }}>
            <SelectTrigger className="w-[160px] bg-[#f5f1ec]/50 border-[#d3cec6] cursor-pointer">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="cursor-pointer" value="all">All Adjustments</SelectItem>
              <SelectItem className="cursor-pointer" value="add">Additions (+)</SelectItem>
              <SelectItem className="cursor-pointer" value="remove">Deductions (-)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-xl border border-[#d3cec6] bg-white overflow-x-auto shadow-sm">
        <Table>
          <TableHeader className="bg-neutral-50/70 border-b border-[#d3cec6]">
            <TableRow>
              <TableHead className="font-semibold text-[#111111] py-4">Timestamp</TableHead>
              <TableHead className="font-semibold text-[#111111] py-4">Account Recipient</TableHead>
              <TableHead className="font-semibold text-[#111111] py-4">Adjustment Type</TableHead>
              <TableHead className="font-semibold text-[#111111] py-4">Amount</TableHead>
              <TableHead className="font-semibold text-[#111111] py-4">Performed By</TableHead>
              <TableHead className="font-semibold text-[#111111] py-4">Audit Reason</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground text-sm">
                  No token transactions found matching filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((tx) => (
                <TableRow key={tx.id} className="hover:bg-neutral-50/50 transition-colors">
                  {/* Timestamp */}
                  <TableCell className="py-4 whitespace-nowrap text-xs text-[#626260]">
                    {new Date(tx.created_at).toLocaleString()}
                  </TableCell>

                  {/* Recipient Account */}
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-[#111111]">
                        {tx.user?.full_name || 'No Name Provided'}
                      </span>
                      <span className="text-xs text-[#626260]">
                        {tx.user?.email || 'N/A'}
                      </span>
                    </div>
                  </TableCell>

                  {/* Adjustment Type Badge */}
                  <TableCell className="py-4">
                    <span className={cn(
                      "inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold border",
                      tx.delta > 0
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    )}>
                      {tx.delta > 0 ? 'Addition' : 'Deduction'}
                    </span>
                  </TableCell>

                  {/* Amount Change */}
                  <TableCell className="py-4 font-bold text-sm">
                    <span className={tx.delta > 0 ? 'text-[#079c37]' : 'text-[#c41c1c]'}>
                      {tx.delta > 0 ? `+${tx.delta}` : tx.delta} credits
                    </span>
                  </TableCell>

                  {/* Performed By */}
                  <TableCell className="py-4">
                    {tx.admin ? (
                      <div className="flex flex-col">
                        <span className="font-semibold text-xs text-[#111111]">
                          {tx.admin.full_name || 'Admin'}
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          {tx.admin.email}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-neutral-400 italic">System Automation</span>
                    )}
                  </TableCell>

                  {/* Audit Reason */}
                  <TableCell className="py-4 text-xs text-[#626260] max-w-xs truncate" title={tx.reason || ''}>
                    {tx.reason || 'No reason provided.'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary Footer */}
      <div className="text-xs text-[#626260] flex items-center justify-between border-t border-[#d3cec6] pt-4">
        <span>Showing {filteredTransactions.length} of {initialTransactions.length} total entries</span>
        <span>Secure cryptographic ledger logging</span>
      </div>
    </div>
  )
}
