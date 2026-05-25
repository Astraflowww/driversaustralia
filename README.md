# 🚀 Drivers Australia — Dynamic Listing Portal

A premium, high-fidelity Listing Portal MVP built with **Next.js 16 (App Router)**, **Supabase**, and **Tailwind CSS**. 

Drivers Australia connects sellers and buyers through a flexible, form-based marketplace. Sellers can build custom listing forms that cost **1 token** to publish, buyers browse listings and submit dynamic responses, and administrators manage user tokens and moderate submissions.

---

## ✨ Features

- 👤 **Auth & Role Management**: Sign up as a **Buyer** or **Seller**. Admin privileges can be granted directly in Supabase.
- 🪙 **Token Economy System**: Sellers start with **3 bonus tokens**. Creating a listing deducts 1 token. Admins can adjust user token balances with audit-reason tracking.
- 🛠️ **Dynamic Form Builder**: Sellers can construct custom questionnaires for their listings (adding text fields, textareas, phone numbers, or dropdown selects) with a live, side-by-side preview.
- 📋 **Moderation Queue**: Listings are saved as `pending` upon creation and must be approved by an Admin before appearing in the public feed.
- 🔎 **Snappy Search & Filters**: Search listings by name and instantly filter them by categories like *Driver*, *Event*, *Service*, and more.
- 🎨 **Premium Aesthetics**: Features a modern dark-mode interface styled with custom OKLCH/HSL color palettes, smooth glowing gradients, responsive layouts, and elegant micro-animations.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (Cookie-based session middleware)
- **Styling**: Tailwind CSS & shadcn/ui
- **Forms & Validation**: React Hook Form & Zod

---

## 📂 Project Structure

```
├── app/
│   ├── (auth)/                     # Login & Register views
│   ├── (public)/                   # Landing grid & Listing details
│   ├── seller/                     # Seller Dashboard & Form Builder
│   ├── admin/                      # Admin Panel & User Token Manager
│   └── api/                        # REST API routes (listings, responses, tokens)
├── components/
│   ├── ui/                         # shadcn/ui primitives
│   ├── listings/                   # Card grids, Form builders & Buyer forms
│   ├── admin/                      # Moderation tables & Token adjustment dialogs
│   └── shared/                     # Responsive Navbar, Token badge & Guards
├── lib/
│   └── supabase/                   # SSR, client, and middleware clients
└── supabase/
    └── migrations/                 # Schema setup & security policies
```

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies

```bash
git clone <your-repo-url>
cd Listing_Template_NextJs
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root of your project:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

> [!WARNING]
> Never commit `.env.local` or your service role keys to GitHub. The project's `.gitignore` is already configured to keep them safe.

### 3. Setup Supabase Database

Run the SQL migration scripts located in [supabase/migrations/](file:///Users/satveekgupta/Developer/Astraflowww/Listing_Template_NextJs/supabase/migrations) directly inside your **Supabase Dashboard SQL Editor** in the following order:

1. **`001_init.sql`**: Configures tables (`profiles`, `listings`, `responses`, `token_transactions`) and creates a trigger to automatically populate a user profile when they register.
2. **`002_tokens.sql`**: Creates atomic token spending and adjustment database functions (`spend_token` and `adjust_user_tokens`).
3. **`003_rls_policies.sql`**: Applies Row Level Security (RLS) policies.
4. **`004_fix_rls_recursion.sql`**: Fixes the infinite recursion error (`42P17`) by routing select/update permissions through `SECURITY DEFINER` helper functions (`is_admin()` and `is_seller()`).

### 4. Admin Account Initialization

Sign up as a normal user through the application's `/register` page, then elevate your account to an admin directly in the SQL Editor:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'hello@satveek.dev';
```

---

## 💻 Local Development

Run the development server:

```bash
npm run dev
```

Build the project for production:

```bash
npm run build
```

Start the production bundle locally:

```bash
npm run start
```
