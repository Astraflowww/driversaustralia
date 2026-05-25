# Code Conventions

This document maps the coding styles, conventions, and database patterns enforced across the Drivers Australia codebase.

## 1. TypeScript Configurations & Patterns

The TypeScript behavior is defined in [tsconfig.json](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/tsconfig.json). Key settings include:
- **Strict Checks**: `"strict": true` is enabled, requiring strict null checks, strict function types, and explicit type declarations.
- **Path Aliasing**: The project uses path mapping `@/*` pointing to `./*` for cleaner imports (e.g., `@/lib/supabase/client` or `@/components/ui/button`).
- **Module Resolution**: Configured to `"moduleResolution": "bundler"` with `"module": "esnext"`, optimized for modern packagers.

### Code Patterns
- **Props Interfaces**: Prop types for React components are declared using standard TypeScript `interface` structures, suffixed with `Props` in `PascalCase`. For example, `RoleGuardProps` in [RoleGuard.tsx](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/components/shared/RoleGuard.tsx#L3-L8):
  ```typescript
  interface RoleGuardProps {
    currentRole: string | null | undefined
    allowedRoles: string[]
    fallback?: React.ReactNode
    children: React.ReactNode
  }
  ```
- **Type Definitions**: Data models are strongly typed to align with the database schemas. For instance, [BrowseClientPage.tsx](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/app/(public)/BrowseClientPage.tsx#L9-L18) defines:
  ```typescript
  interface Listing {
    id: string
    title: string
    description: string | null
    category: string
    created_at: string
    profiles?: {
      full_name: string | null
    }
  }
  ```
- **Build-Time Mocking**: To prevent compilation errors when environment variables are missing during pre-rendering and build-time static generation, the Supabase client helpers return typed mocks. For example, in [client.ts](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/lib/supabase/client.ts#L7-L23):
  ```typescript
  if (!url || !anonKey) {
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        // ... other mocked methods
      }
    } as any
  }
  ```

---

## 2. Style Guidelines & UI Patterns

Styling is structured using **Tailwind CSS v4** with a custom editorial design theme. 

### Tailwind CSS v4 Themes
The global stylesheet [globals.css](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/app/globals.css) implements Tailwind v4 styles:
- **Theme Variables**: Defined inline under `@theme inline` mapping to CSS custom variables in `:root` and `.dark`.
- **Canvas Colors**: The canvas has a warm cream-white base color (`#f5f1ec`) instead of pure white, indicating a warm, editorial layout.
- **Surface Elevation**: Cards sit as pure white blocks (`--card: #ffffff`, surface-1) floating on the cream background. Drop shadows are avoided; depth is expressed through the contrast between the white card and the cream canvas.
- **Hairlines**: Thin gray borders (`--border: #d3cec6`) separate components.
- **Brand Accents**: Confidence orange (`--fin-orange: #ff5600`) represents the primary brand accent (used on CTA buttons and token counts), alongside a deep brand blue (`--brand-blue: #0007cb`).
- **Border Radii**: Modest radii are used: `rounded.lg` (12px) for cards/lists, `rounded.xl` (16px) for mockup screenshots/large panels, `rounded.md` (8px) for buttons/inputs, and `rounded.xs` (4px) for badges/tags.

### UI Helper Utilities
Class names are merged using a custom `cn` helper in [utils.ts](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/lib/utils.ts):
```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```
This merges static Tailwind classes with dynamic overrides without class clashes.

---

## 3. React & Next.js Conventions

The project runs on **Next.js 16.2.6** and **React 19.2.4**, adopting the Next.js App Router paradigm.

### Server vs. Client Component Boundaries
- **Server Components**: The default state. All data fetching is carried out directly on the server in layouts or page routes using the Supabase server client (e.g., [page.tsx](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/app/(public)/page.tsx#L8-L30)). They fetch data securely and render the skeleton, passing structured data to client-side controllers.
- **Client Components**: Explicitly declared using the `'use client'` directive at the top of the file. Interactive surfaces (like forms, grids with client-side searches, and toggles) are written as Client Components. Example: [BrowseClientPage.tsx](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/app/(public)/BrowseClientPage.tsx#L1).
- **Asynchronous Stores**: Next.js 16 conventions dictate that cookie stores are asynchronous. Database fetching routes and middleware await cookie parsing:
  ```typescript
  const cookieStore = await cookies()
  ```

### Protected Routes and Role-Based Redirects
Access rules are parsed by the edge middleware [middleware.ts](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/middleware.ts):
- It intercepts requests and updates the Supabase session token.
- Roles are evaluated (`buyer`, `seller`, `admin`).
- Unauthenticated requests to `/seller` or `/admin` routes are redirected to `/login?redirect=...`.
- Authenticated users attempting to visit login/register routes are redirected to their corresponding dashboards.
- Users who do not possess the required role are redirected to the homepage `/`.

---

## 4. Database & Supabase Conventions

All tables, views, and functions are written in PostgreSQL and updated via migrations in [supabase/migrations/](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/supabase/migrations/).

### Schema Conventions
- **Identifiers**: Snake-case is used for tables (e.g., `profiles`, `listings`, `responses`, `token_transactions`) and column names (`full_name`, `form_schema`, `submitted_at`).
- **Primary Keys**: UUIDs are standard (`UUID PRIMARY KEY DEFAULT gen_random_uuid()` or references to the auth table).
- **Timestamps**: Default to `TIMESTAMPTZ` with `NOW()` as standard.
- **SQL Styling**: Database statements use uppercase keywords (`CREATE TABLE`, `ALTER TABLE`, `RETURNS trigger AS $$`).

### Row Level Security (RLS) & Recursion Prevention
- **RLS Enforced**: Row Level Security is enabled on every database table.
- **Recursion Resolution**: Direct references to profiles in security checks on the `profiles` table caused circular RLS evaluations. To resolve this, helper functions with `SECURITY DEFINER` are declared, which run with superuser privileges (bypassing RLS) and return role booleans. They are then used inside policies in [004_fix_rls_recursion.sql](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/supabase/migrations/004_fix_rls_recursion.sql):
  ```sql
  CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
  RETURNS boolean AS $$
  BEGIN
    RETURN EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = user_id AND role = 'admin'
    );
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  ```
  This is implemented in policies:
  ```sql
  CREATE POLICY "Admins can view all profiles" 
    ON public.profiles FOR SELECT 
    USING (public.is_admin(auth.uid()));
  ```

### Atomic Transactions
To handle high-stakes transactions (like subtracting seller tokens during listing creation), the logic is kept inside atomic PL/pgSQL database functions (e.g., `spend_token` and `adjust_user_tokens` in [002_tokens.sql](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/supabase/migrations/002_tokens.sql)). This ensures that token adjustments and transaction history logs are written in a single database transaction.

---

## 5. Coding & Naming Conventions

### File Structure and Naming
- **Components**: Component files utilize `PascalCase` and match their main export component name (e.g., `TokenBadge.tsx`).
- **Utility & Hook Files**: Lowercase or `camelCase` (e.g., `client.ts`, `middleware.ts`).
- **Route Directories**: Next.js App Router folders use lower-case names. Protected grouping is done using parentheses (`(auth)`, `(public)`). Dynamic slugs use brackets (`[id]`).
- **SQL Migrations**: Prefixed with 3-digit serial order pads (e.g., `001_init.sql`, `002_tokens.sql`).

### Syntax Styling
- **Indentation**: 2 spaces.
- **Semicolons**: Generally omitted in TypeScript statements.
- **Quotes**: Double quotes are favored in configurations and utility declarations; single quotes are common inside React components.
- **Component Style**: Named export declarations for component functions rather than default exports (e.g., `export function ListingCard(...)`).
- **State Constants**: Upper-case constants for configuration arrays (e.g., `CATEGORIES` in `BrowseClientPage.tsx`).
