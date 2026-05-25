import React from 'react'

interface RoleGuardProps {
  currentRole: string | null | undefined
  allowedRoles: string[]
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function RoleGuard({
  currentRole,
  allowedRoles,
  fallback = null,
  children,
}: RoleGuardProps) {
  if (!currentRole || !allowedRoles.includes(currentRole)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
