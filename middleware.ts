import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Set custom header with current pathname to make it accessible in server layouts
  request.headers.set('x-pathname', path)

  const { supabaseResponse, user, role } = await updateSession(request)

  // Public/Auth routes
  const isAuthRoute = path.startsWith('/login') || path.startsWith('/register')
  const isSellerRoute = path.startsWith('/seller')
  const isAdminRoute = path.startsWith('/admin')
  const isMessagesRoute = path.startsWith('/messages')

  // If not logged in and trying to access protected routes, redirect to login
  if (!user && (isSellerRoute || isAdminRoute || isMessagesRoute)) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', path)
    return NextResponse.redirect(url)
  }

  // If logged in
  if (user) {
    // If logged in and trying to access auth pages, redirect to dashboard
    if (isAuthRoute) {
      const url = request.nextUrl.clone()
      if (role === 'admin') {
        url.pathname = '/admin/dashboard'
      } else if (role === 'seller') {
        url.pathname = '/seller/dashboard'
      } else {
        url.pathname = '/'
      }
      return NextResponse.redirect(url)
    }

    // Role-based route protection
    if (isSellerRoute && role !== 'seller') {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }

    if (isAdminRoute && role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
