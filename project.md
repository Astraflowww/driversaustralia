# 🚀 Listing Portal MVP — Project Document

> **Client MVP**: A marketplace where sellers post form-based listings, buyers respond to them, and admins control visibility & token credits.
> **Stack**: Next.js 14 (App Router) · Supabase · Tailwind CSS · Vercel

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, monolith) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (Email/Password + Magic Link) |
| Storage | Supabase Storage (listing images, if needed) |
| Styling | Tailwind CSS + shadcn/ui |
| Deployment | Vercel |
| Forms | React Hook Form + Zod |
| State | Zustand (client state) |

---

## 🗂️ Project Structure

```
listing-portal/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (public)/
│   │   ├── page.tsx                  # Home / Browse listings
│   │   └── listings/[id]/page.tsx    # Listing detail + buyer form
│   ├── (seller)/
│   │   ├── dashboard/page.tsx        # Seller dashboard
│   │   ├── listings/
│   │   │   ├── new/page.tsx          # Create listing
│   │   │   └── [id]/responses/page.tsx # View buyer responses
│   ├── (admin)/
│   │   ├── dashboard/page.tsx        # Admin panel
│   │   ├── listings/page.tsx         # Approve / reject listings
│   │   └── users/page.tsx            # Manage tokens per user
│   └── api/
│       ├── listings/
│       │   ├── route.ts              # GET (all approved), POST (create)
│       │   └── [id]/
│       │       ├── route.ts          # GET single, PATCH, DELETE
│       │       └── approve/route.ts  # Admin approve action
│       ├── responses/
│       │   └── route.ts              # POST buyer response
│       └── tokens/
│           └── route.ts              # Admin add/remove tokens
├── components/
│   ├── ui/                           # shadcn/ui base components
│   ├── listings/
│   │   ├── ListingCard.tsx
│   │   ├── ListingForm.tsx           # Seller creates listing
│   │   ├── ListingGrid.tsx
│   │   └── BuyerResponseForm.tsx
│   ├── admin/
│   │   ├── TokenManager.tsx
│   │   └── ListingApprovalTable.tsx
│   └── shared/
│       ├── Navbar.tsx
│       ├── RoleGuard.tsx
│       └── TokenBadge.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # Browser client
│   │   └── server.ts                 # Server client (RSC / API routes)
│   ├── validations/
│   │   ├── listing.ts                # Zod schemas
│   │   └── response.ts
│   └── hooks/
│       ├── useListings.ts
│       └── useTokens.ts
├── middleware.ts                     # Auth + role-based route protection
└── supabase/
    └── migrations/
        ├── 001_init.sql
        ├── 002_tokens.sql
        └── 003_rls_policies.sql
```

---

## 🗄️ Database Schema (Supabase)

### `profiles` (extends `auth.users`)
```sql
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT,
  role        TEXT NOT NULL DEFAULT 'buyer',  -- 'buyer' | 'seller' | 'admin'
  tokens      INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### `listings`
```sql
CREATE TABLE listings (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id    UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  description  TEXT,
  category     TEXT,                          -- e.g. 'driver', 'event', etc.
  form_schema  JSONB NOT NULL,               -- dynamic form fields definition
  status       TEXT DEFAULT 'pending',        -- 'pending' | 'approved' | 'rejected'
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);
```

**`form_schema` JSON shape** (flexible per listing):
```json
[
  { "id": "name",    "label": "Full Name",    "type": "text",   "required": true },
  { "id": "phone",   "label": "Phone Number", "type": "tel",    "required": true },
  { "id": "message", "label": "Your Message", "type": "textarea","required": false }
]
```

### `responses` (buyer submissions)
```sql
CREATE TABLE responses (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id   UUID REFERENCES listings(id) ON DELETE CASCADE,
  buyer_id     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  form_data    JSONB NOT NULL,              -- buyer's filled answers
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `token_transactions` (audit log)
```sql
CREATE TABLE token_transactions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES profiles(id),
  admin_id    UUID REFERENCES profiles(id),
  delta       INT NOT NULL,               -- positive = add, negative = remove
  reason      TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔐 Row Level Security (RLS) Policies

```sql
-- profiles: users read their own; admins read all
-- listings: sellers CRUD their own; public reads approved; admins read all
-- responses: sellers read responses for their listings; buyers create
-- token_transactions: admin only
```

> Full SQL in `supabase/migrations/003_rls_policies.sql`

---

## 🧩 Core Features & Implementation Plan

### 1. Auth & Roles
- Supabase Auth (email/password)
- On signup, insert row into `profiles` with `role = 'buyer'`
- Seller role assigned manually by admin (or via separate upgrade flow)
- `middleware.ts` checks session + role, redirects unauthorized access

### 2. Token System
- Each seller has a `tokens` count in `profiles`
- **Creating a listing** deducts 1 token (check before insert, use Supabase RPC or transaction)
- Admin can add/remove tokens from `/admin/users`
- All changes logged in `token_transactions`

```ts
// lib/tokens.ts — atomic token deduction via Supabase RPC
const { error } = await supabase.rpc('spend_token', { seller_id: userId })
```

```sql
-- Supabase function
CREATE OR REPLACE FUNCTION spend_token(seller_id UUID)
RETURNS void AS $$
BEGIN
  IF (SELECT tokens FROM profiles WHERE id = seller_id) < 1 THEN
    RAISE EXCEPTION 'Insufficient tokens';
  END IF;
  UPDATE profiles SET tokens = tokens - 1 WHERE id = seller_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 3. Listings (Seller)
- `/seller/listings/new` → form to create listing title, description, category
- **Dynamic form builder** (MVP: add text/textarea/select/tel fields with label + required toggle)
- `form_schema` stored as JSONB in `listings`
- On submit: check tokens → deduct → insert listing with `status = 'pending'`
- Listing goes to admin queue

### 4. Listings (Public)
- `/` → grid of all `approved` listings (paginated, filter by category)
- `/listings/[id]` → renders dynamic form from `form_schema`
- Buyer fills and submits → insert into `responses`

### 5. Admin Panel
- `/admin/listings` → table of pending/approved/rejected listings, with Approve / Reject buttons
- `/admin/users` → list all users, show token count, input to add/remove tokens
- Protected by `role = 'admin'` check in middleware

### 6. Seller Dashboard
- `/seller/dashboard` → list of own listings + status badges (pending/approved/rejected)
- `/seller/listings/[id]/responses` → table of buyer responses with form_data rendered

---

## 🛣️ Routes Summary

| Path | Access | Description |
|---|---|---|
| `/` | Public | Browse approved listings |
| `/listings/[id]` | Public | View listing + submit buyer form |
| `/login` `/register` | Public | Auth pages |
| `/seller/dashboard` | Seller | Manage own listings |
| `/seller/listings/new` | Seller | Create listing (costs 1 token) |
| `/seller/listings/[id]/responses` | Seller | View buyer responses |
| `/admin/dashboard` | Admin | Overview stats |
| `/admin/listings` | Admin | Approve / reject listings |
| `/admin/users` | Admin | Manage user tokens |

---

## 🔌 API Routes

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/listings` | GET | Public | Get approved listings |
| `/api/listings` | POST | Seller | Create listing (deducts token) |
| `/api/listings/[id]` | GET | Public | Get single listing |
| `/api/listings/[id]/approve` | PATCH | Admin | Approve / reject listing |
| `/api/responses` | POST | Buyer | Submit buyer form |
| `/api/responses?listing_id=x` | GET | Seller | Get responses for own listing |
| `/api/tokens` | PATCH | Admin | Add/remove tokens from user |

---

## ⚙️ Environment Variables

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # for admin API routes only
```

---

## 🚀 Setup & Deployment Steps

### Local Setup
```bash
# 1. Create Next.js project
npx create-next-app@latest listing-portal --typescript --tailwind --app

# 2. Install dependencies
npm install @supabase/supabase-js @supabase/ssr
npm install react-hook-form zod @hookform/resolvers
npm install zustand
npx shadcn@latest init

# 3. Add shadcn components
npx shadcn@latest add button input label textarea select table badge card dialog

# 4. Set up Supabase
# - Create project at supabase.com
# - Run migration SQL files in Supabase SQL Editor
# - Enable RLS on all tables
# - Copy URL + keys to .env.local

# 5. Run locally
npm run dev
```

### Vercel Deployment
```bash
# 1. Push to GitHub
git init && git add . && git commit -m "initial commit"
gh repo create listing-portal --public --push

# 2. Import on vercel.com
# - Connect GitHub repo
# - Add environment variables (same as .env.local)
# - Deploy
```

---

## 📋 MVP Checklist

### Auth
- [ ] Register page (email + password + role selection: buyer/seller)
- [ ] Login page
- [ ] Session-aware Navbar with role-based links
- [ ] Middleware protecting seller/admin routes

### Seller
- [ ] Dashboard listing own listings + status
- [ ] Create listing form with dynamic field builder
- [ ] Token balance shown in dashboard
- [ ] Block listing creation if 0 tokens (with clear error)
- [ ] View buyer responses per listing

### Buyer
- [ ] Browse all approved listings on home page
- [ ] Filter by category
- [ ] View listing detail with rendered dynamic form
- [ ] Submit form → success message

### Admin
- [ ] View all pending listings
- [ ] Approve / reject with one click
- [ ] View all users
- [ ] Add / remove tokens from any user
- [ ] Transaction history visible

### Infrastructure
- [ ] Supabase RLS policies for all tables
- [ ] `spend_token` atomic RPC function
- [ ] `.env.local` setup documented
- [ ] Deployed to Vercel

---

## 🧱 Component Priority Order (Build Sequence)

1. **Supabase setup** → schema migrations + RLS + RPC functions
2. **Auth pages** → login, register, middleware
3. **Profiles** → role assignment on signup
4. **Public listing browse** → home page + listing detail
5. **Buyer form submission** → dynamic form render + `responses` insert
6. **Seller dashboard** → create listing + token check + view responses
7. **Admin panel** → approve listings + manage tokens
8. **Polish** → loading states, error boundaries, toast notifications

---

## 💡 Notes for Team

- Use **Server Components** for data fetching wherever possible (listing grid, dashboards)
- Use **Server Actions** or **API routes** for mutations (create listing, approve, token changes)
- The `form_schema` JSONB approach keeps the listing form flexible — the same codebase handles drivers, events, or any future category without schema changes
- For MVP, the dynamic form builder can be a simple "add field" UI (label + type + required) — no drag/drop needed yet
- Admin role should be seeded directly in Supabase dashboard for the MVP demo (`UPDATE profiles SET role = 'admin' WHERE email = 'admin@demo.com'`)
- Keep a `DEMO.md` with seed data instructions and test accounts for the client presentation
