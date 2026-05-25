# Codebase Structure

This document provides a detailed directory map and defines the specific roles of keys directories and files in the Drivers Australia application.

---

## 1. Directory Tree Map

```
driversaustralia/
├── app/                              # Next.js App Router root
│   ├── (auth)/                       # Auth routing group (public)
│   │   ├── login/                    # Login page
│   │   └── register/                 # Signup and registration page
│   ├── (public)/                     # Public routes folder
│   │   ├── listings/[id]/            # Public details page + application form
│   │   ├── BrowseClientPage.tsx      # Interactive public directory search/filter
│   │   └── page.tsx                  # Landing / index page
│   ├── admin/                        # Admin restricted routing group
│   │   ├── dashboard/                # Admin landing and statistics view
│   │   ├── listings/                 # Admin listing approval queue
│   │   └── users/                    # Admin token manager panel
│   ├── api/                          # Server API Route handlers
│   │   ├── listings/                 # POST (create), GET (fetch approved)
│   │   │   └── [id]/                 # GET, PATCH, DELETE operations
│   │   │       └── approve/          # POST moderation status updates
│   │   ├── responses/                # POST applications, GET listing results
│   │   └── tokens/                   # POST admin token adjustments
│   ├── seller/                       # Seller restricted routing group
│   │   ├── dashboard/                # Seller listing list and status view
│   │   └── listings/                 # Create listings routing
│   │       ├── [id]/responses/       # View buyer response submissions
│   │       └── new/                  # Form page to create job postings
│   ├── favicon.ico                   # Shortcut icon
│   ├── globals.css                   # Tailwind v4 directives, custom themes
│   └── layout.tsx                    # Root HTML layout, navbar, and font imports
├── components/                       # Shared React UI components
│   ├── admin/                        # Admin specific components
│   │   ├── ListingApprovalTable.tsx  # Admin approval queue listing component
│   │   └── TokenManager.tsx          # Token adjustments and auditing manager
│   ├── listings/                     # Job listings UI components
│   │   ├── BuyerResponseForm.tsx     # Dynamic rendering of form_schema schemas
│   │   ├── ListingCard.tsx           # Individual listing card wrapper
│   │   ├── ListingForm.tsx           # Seller form builder and validator
│   │   └── ListingGrid.tsx           # Multi-column grid representation
│   ├── shared/                       # App-wide global components
│   │   ├── Navbar.tsx                # Context-aware responsive navigation header
│   │   ├── RoleGuard.tsx             # Declarative role-based visibility wrapper
│   │   └── TokenBadge.tsx            # Simple indicator badge for token counts
│   └── ui/                           # Base design system primitives (shadcn/ui)
├── lib/                              # Core library code and helpers
│   ├── supabase/                     # Supabase database client utilities
│   │   ├── client.ts                 # Browser client (with build-time mocks)
│   │   ├── middleware.ts             # Session updates (with build-time mocks)
│   │   └── server.ts                 # Server client (with cookies & mocks)
│   └── utils.ts                      # Tailwind merger utility (`cn`)
├── supabase/                         # Cloud backend configurations
│   └── migrations/                   # Sequential schema migration files
│       ├── 001_init.sql              # Init tables and signup trigger
│       ├── 002_tokens.sql            # PL/pgSQL transaction functions
│       ├── 003_rls_policies.sql      # Standard Row Level Security setup
│       └── 004_fix_rls_recursion.sql # Security definer helpers for recursion fix
```

---

## 2. Component Directory Breakdown

### `components/listings/`
*   **[ListingForm.tsx](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/components/listings/ListingForm.tsx)**: Features a dynamic question-creator interface. Sellers can add questions of type `text`, `textarea`, `tel`, and `select` (with custom choices). Submits payloads to `/api/listings`.
*   **[BuyerResponseForm.tsx](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/components/listings/BuyerResponseForm.tsx)**: Parses the listing's `form_schema` JSONB data structure and outputs matching input, textarea, select, or tel forms with proper validation checks.

### `components/admin/`
*   **[ListingApprovalTable.tsx](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/components/admin/ListingApprovalTable.tsx)**: Displays pending, approved, and rejected listings. Permits admins to toggle statuses directly.
*   **[TokenManager.tsx](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/components/admin/TokenManager.tsx)**: Renders a user search grid, allowing token adjustments (adding/removing) and displaying a paginated audit ledger of all transaction records.

### `components/shared/`
*   **[Navbar.tsx](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/components/shared/Navbar.tsx)**: Incorporates user auth states. Conditionally renders login/register/sign-out controls alongside context-sensitive navigation links based on user roles.

---

## 3. Core Database Migration Scripts

*   **[001_init.sql](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/supabase/migrations/001_init.sql)**:
    *   Creates tables: `profiles`, `listings`, `responses`, `token_transactions`.
    *   Implements the trigger `on_auth_user_created` executing `handle_new_user()` to hook into Supabase Auth signup events. It inserts profile rows and awards 3 free tokens to new sellers.
*   **[002_tokens.sql](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/supabase/migrations/002_tokens.sql)**:
    *   `spend_token(seller_id)`: Atomically validates balances and deducts a token when a listing is created, logging the transaction.
    *   `adjust_user_tokens(target_user_id, admin_user_id, token_delta, transaction_reason)`: Authorizes admins to modify token counts and record updates in the transaction history.
*   **[004_fix_rls_recursion.sql](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/supabase/migrations/004_fix_rls_recursion.sql)**:
    *   Declares `is_admin(user_id)` and `is_seller(user_id)` as `SECURITY DEFINER` functions, allowing role resolution while avoiding RLS recursion.
