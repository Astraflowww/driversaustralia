# Tech Stack

This document details the exact technologies, frameworks, runtime configurations, packages, and tools that make up the Drivers Australia application.

## 1. Core Framework & Runtime

*   **Framework**: [Next.js](https://nextjs.org/) `16.2.6` (App Router)
    *   Utilizes React Server Components (RSC) by default.
    *   Server actions and asynchronous cookies API (`cookies()`) aligned with Next.js 16 requirements.
*   **Library**: [React](https://react.dev/) `19.2.4` & `react-dom` `19.2.4`
*   **Runtime Environment**: Node.js (Version compatibility: Node 18+ or 20+ matching Next.js 16 specifications)
*   **Language**: [TypeScript](https://www.typescriptlang.org/) `^5.0.0`
    *   Defined in [tsconfig.json](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/tsconfig.json) with strict settings (`"strict": true`).

## 2. Styling & Design System

*   **Styling Engine**: [Tailwind CSS](https://tailwindcss.com/) `v4.0.0`
    *   Configured inline inside the global stylesheet [globals.css](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/app/globals.css) via `@theme inline`.
    *   PostCSS integration via `@tailwindcss/postcss` and [postcss.config.mjs](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/postcss.config.mjs).
*   **UI Primitives**: [Base UI](https://base-ui.com/) `@base-ui/react` `^1.5.0` (unstyled component library)
*   **Tailwind Extensions**:
    *   `tw-animate-css` `^1.4.0` (utility animations)
    *   `class-variance-authority` `^0.7.1` (CVA for creating styled component variants)
    *   `clsx` `^2.1.1` (conditional class string formatting)
    *   `tailwind-merge` `^3.6.0` (conflict-free Tailwind utility classes merging)
*   **UI Library System**: [shadcn/ui](https://ui.shadcn.com/) `v4.8.0` CLI config.
    *   Defined in [components.json](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/components.json).
*   **Iconography**: [Lucide React](https://lucide.dev/) `^1.16.0`
*   **Animations**: [Framer Motion](https://www.framer.com/motion/) `^12.40.0`

## 3. Database & Backend Integration

*   **Platform**: [Supabase](https://supabase.com/) (PostgreSQL Database, Auth, and Storage)
*   **Client Libraries**:
    *   `@supabase/supabase-js` `^2.106.1` (Core Supabase JS library)
    *   `@supabase/ssr` `^0.10.3` (Supabase Server-Side Rendering helper for cookies handling)

## 4. Form Management & Validation

*   **Form Handler**: [React Hook Form](https://react-hook-form.com/) `^7.76.1`
*   **Schema Validation**: [Zod](https://zod.dev/) `^4.4.3`
*   **Resolver**: `@hookform/resolvers` `^5.4.0` (Integrates React Hook Form with Zod schemas)

## 5. Development & Build Tools

*   **Linting**: [ESLint](https://eslint.org/) `^9.0.0`
    *   Configured via [eslint.config.mjs](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/eslint.config.mjs) utilizing the standard `eslint-config-next` (`16.2.6`) configurations.
*   **Config Files**:
    *   [tsconfig.json](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/tsconfig.json) (TypeScript configurations)
    *   [eslint.config.mjs](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/eslint.config.mjs) (Linter rules)
    *   [next.config.ts](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/next.config.ts) (Next.js configurations)
    *   [postcss.config.mjs](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/postcss.config.mjs) (PostCSS configs for Tailwind v4)
    *   [components.json](file:///Users/satveekgupta/Developer/Astraflowww/driversaustralia/components.json) (shadcn/ui configuration metadata)

## 6. Project Environment Variables

Required environment configuration details:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```
*Note: Client-side helpers check for these variables and fallback to mock clients if they are not provided (e.g. during build/pre-rendering processes).*
