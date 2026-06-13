-- 1. Add status column to responses table with check constraint
ALTER TABLE public.responses ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));

-- 2. Drop existing seller update policy on responses if it exists
DROP POLICY IF EXISTS "Sellers can update responses for their listings" ON public.responses;

-- 3. Create RLS policy allowing sellers to update responses for their listings (to approve/reject them)
CREATE POLICY "Sellers can update responses for their listings"
  ON public.responses FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.listings
      WHERE id = public.responses.listing_id AND seller_id = auth.uid()
    )
  );
