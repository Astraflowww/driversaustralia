# Integrations Map

This document maps all internal and external integrations, API architectures, authentication flows, and database interactions within the Drivers Australia codebase.

## 1. Supabase Client & SSR Integration

Authentication and data storage are managed through **Supabase**. Next.js 16/React 19 Server-Side Rendering (SSR) states integrate with Supabase cookies using `@supabase/ssr` helpers.

### Supabase Initialization Helpers
*   **Browser Client**: [client.ts](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/lib/supabase/client.ts)
    *   Initiated via `createBrowserClient(url, anonKey)` for interactive client-side operations.
    *   Implements build-time fallback mocks if env vars are missing to allow successful static builds.
*   **Server Client**: [server.ts](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/lib/supabase/server.ts)
    *   Initiated via `createServerClient(url, anonKey, { cookies })` to read and write cookie values.
    *   Must await the asynchronous `cookies()` store from `next/headers` before instantiation due to Next.js 16 conventions.
    *   Contains fallback mocks to support safe static optimization paths during builds.
*   **Middleware Client**: [middleware.ts](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/lib/supabase/middleware.ts)
    *   Initiated to refresh sessions automatically on matching request paths.
    *   Propagates refreshed cookies back to Next.js middleware routing request/response headers.

---

## 2. Authentication & Authorization Flow

The user session lifecycle relies on **Supabase Auth**.

1.  **Auth State Preservation**: Session states are persisted in browser cookies managed by Supabase.
2.  **Session Refresh**: The Edge middleware [middleware.ts](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/middleware.ts) invokes `updateSession` to verify validity.
3.  **Role Injection**: During session checking, the middleware queries the `profiles` table to resolve the active user's role (`buyer`, `seller`, `admin`).
4.  **Route Protection**:
    *   Unauthenticated users targeting `/seller` or `/admin` routes are redirected to `/login` with a `redirect` search param.
    *   Authenticated users targeting `/login` or `/register` are redirected to their designated dashboard.
    *   Authenticated users attempting to access routes above their role levels are sent back to the homepage `/`.

---

## 3. Database Integrations (PostgreSQL & Supabase)

Database migrations are defined inside [supabase/migrations/](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/supabase/migrations/).

### Tables & Relationships
*   **`profiles`**: Extends the default Supabase `auth.users` authentication records.
    *   Maintains the `role` enum (`buyer`, `seller`, `admin`) and the integer `tokens` balance.
*   **`listings`**: Houses dynamic job listings.
    *   Each listing references a profile `seller_id` and records a JSONB `form_schema` structure representing dynamic field configurations.
*   **`responses`**: Stores candidate submissions.
    *   Links to `listings` and captures answers as a JSONB `form_data` payload.
*   **`token_transactions`**: Audit logs tracking token adjustments.
    *   Contains integer delta values and text explanations.

### Custom Postgres Functions & Triggers
*   **`handle_new_user()` Trigger**: Configured in [001_init.sql](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/supabase/migrations/001_init.sql#L59-L100).
    *   Hooks into new inserts on `auth.users`.
    *   Extracts `role` and `full_name` from metadata inputs.
    *   Assigns a default registration gift of **3 tokens** to users choosing the `seller` role (buyers get 0 tokens) and inserts the record into `profiles`.
*   **`spend_token(seller_id UUID)` RPC**: Configured in [002_tokens.sql](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/supabase/migrations/002_tokens.sql#L2-L27).
    *   Atomically checks a seller's token balance.
    *   Deducts **1 token** and logs the event in `token_transactions` within a transaction block.
*   **`adjust_user_tokens(...)` RPC**: Configured in [002_tokens.sql](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/supabase/migrations/002_tokens.sql#L30-L68).
    *   Allows admins to atomically adjust any user's token balance and record transaction logs.

---

## 4. Internal API Endpoints

Next.js route handlers process data updates using server-side client configurations:

| Endpoint | Method | Role | Description | Code Location |
|---|---|---|---|---|
| `/api/listings` | **GET** | Public | Returns a list of approved listings. | [route.ts](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/app/api/listings/route.ts#L5-L21) |
| `/api/listings` | **POST** | Seller | Validates parameters, triggers `spend_token` RPC, and inserts a pending listing. | [route.ts](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/app/api/listings/route.ts#L24-L82) |
| `/api/listings/[id]` | **GET** | Public | Returns details for a specific listing. | [route.ts](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/app/api/listings/%5Bid%5D/route.ts#L6-L23) |
| `/api/listings/[id]` | **PATCH**| Seller | Modifies a listing. The policy forces the status back to `pending`. | [route.ts](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/app/api/listings/%5Bid%5D/route.ts#L26-L53) |
| `/api/listings/[id]` | **DELETE**| Seller/Admin | Removes a listing from the database. | [route.ts](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/app/api/listings/%5Bid%5D/route.ts#L56-L77) |
| `/api/listings/[id]/approve`| **POST** | Admin | Updates a listing's moderation status (`approved` or `rejected`). | [route.ts](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/app/api/listings/%5Bid%5D/approve/route.ts#L5-L48) |
| `/api/responses` | **GET** | Seller/Admin | Retrieves responses matching a target listing ID. | [route.ts](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/app/api/responses/route.ts#L22-L73) |
| `/api/responses` | **POST** | Public | Submits a buyer application matching a target listing. | [route.ts](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/app/api/responses/route.ts#L5-L19) |
| `/api/tokens` | **POST** | Admin | Invokes `adjust_user_tokens` to update token balances. | [route.ts](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/app/api/tokens/route.ts#L5-L39) |
