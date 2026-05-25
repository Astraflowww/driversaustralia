import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    return { supabaseResponse, user: null, role: null }
  }

  const supabase = createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // This refreshes the session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get user role if logged in
  let role = null
  if (user) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      
      if (profile) {
        role = profile.role
      } else {
        // Fallback to metadata role if the database profile row isn't created yet
        role = user.user_metadata?.role || 'buyer'
      }
    } catch (e) {
      // Fallback if profiles table is missing, offline or connection fails
      role = user.user_metadata?.role || 'buyer'
    }
  }

  return { supabaseResponse, user, role }
}
