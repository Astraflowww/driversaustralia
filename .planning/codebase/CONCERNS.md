# Technical Concerns & Risks

This document outlines technical debt, design discrepancies, security considerations, and potential scaling bottlenecks identified in the Drivers Australia codebase.

---

## 1. Architectural & Transaction Integrity

### Non-Atomic Listing Creation and Token Spend
*   **The Issue**: Inside [route.ts](/Users/satveekgupta/Developer/Astraflowww/driversaustralia/app/api/listings/route.ts#L53-L76), creating a listing consists of two separate database invocations:
    1.  Call the `spend_token` RPC function to deduct 1 token.
    2.  Insert the listing into the `listings` table.
*   **The Risk**: If the RPC succeeds (token is deducted and transaction committed) but the subsequent `insert` operation fails (due to database connection limits, schema constraints, or malformed body data), the user's token is lost forever without any listing being generated.
*   **Recommendation**: Refactor listing insertion to occur inside a single PL/pgSQL transaction or PostgreSQL function (RPC) that handles both token deduction and listing creation in one atomic unit of work.

### Deletion and Rejection Policies
*   **Token Consumption on Rejection**: When an admin rejects a pending listing, the token spent to create the listing is not refunded. Although sellers are permitted to modify rejected listings to resubmit them (which triggers a status update back to `pending` via [route.ts](/Users/satveekgupta/Developer/Astraflowww/driversaustralia/app/api/listings/[id]/route.ts#L67) without consuming additional tokens), there is no mechanism for sellers to receive a refund if they choose to delete the rejected listing instead.
*   **Listing Deletion**: Sellers can delete their own listings, but no token refund is issued. If a listing was created by mistake or rejected permanently, the token is gone.

---

## 2. Security Considerations

### Lack of JSONB Schema Validation on API Routes
*   **The Issue**: The API routes [listings/route.ts](/Users/satveekgupta/Developer/Astraflowww/driversaustralia/app/api/listings/route.ts#L49-L51) and [listings/[id]/route.ts](/Users/satveekgupta/Developer/Astraflowww/driversaustralia/app/api/listings/[id]/route.ts#L57-L68) accept a `form_schema` parameter and insert it directly into the database as a JSONB payload without verifying its internal shape.
*   **The Risk**: Malicious users could bypass the frontend UI to insert invalid schemas (e.g. fields missing `id`s, containing duplicate ids, or featuring unexpected custom input types). This can cause the client-side dynamic form compiler [BuyerResponseForm.tsx](/Users/satveekgupta/Developer/Astraflowww/driversaustralia/components/listings/BuyerResponseForm.tsx) to crash or fail when buyers attempt to render the application fields.
*   **Recommendation**: Validate the `form_schema` JSON array on the backend using a Zod schema before executing database write commands.

### Inconsistency in Buyer Response Queries
*   **The Issue**: The database Row-Level Security (RLS) policy `Buyers can view their own submitted responses` in [003_rls_policies.sql](/Users/satveekgupta/Developer/Astraflowww/driversaustralia/supabase/migrations/003_rls_policies.sql#L128-L130) allows buyers to select their own submitted responses. However, the Next.js API route [responses/route.ts](/Users/satveekgupta/Developer/Astraflowww/driversaustralia/app/api/responses/route.ts#L88-L90) restricts response reading exclusively to listing owners (sellers) and administrators.
*   **The Risk**: Buyers cannot fetch or review their submission histories via the API, making the RLS allowance redundant. If a future requirement demands showing buyers their submission history, the API route must be rewritten.

---

## 3. Configuration & Technical Debt

### Lack of Zustand Global State Management
*   **The Issue**: [project.md](/Users/satveekgupta/Developer/Astraflowww/driversaustralia/project.md#L19) states that the application uses Zustand for global client-side state management. However, Zustand is not included in `package.json` dependencies and is not used anywhere in the codebase.
*   **The Status**: Currently, the application manages interactive states locally (via `useState`) and forces data syncs using router navigation updates (`router.refresh()`).
*   **Impact**: While acceptable for the MVP, as more features are added (like real-time notification overlays or multi-step draft creations), the lack of a proper global store could lead to complex prop-drilling.
