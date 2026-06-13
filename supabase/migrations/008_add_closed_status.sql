-- 1. Recreate the status check constraint to include 'closed' status
ALTER TABLE public.listings DROP CONSTRAINT IF EXISTS listings_status_check;
ALTER TABLE public.listings ADD CONSTRAINT listings_status_check CHECK (status IN ('pending', 'approved', 'rejected', 'closed'));

-- 2. Drop the old seller update policy
DROP POLICY IF EXISTS "Sellers can update their own pending/rejected listings" ON public.listings;

-- 3. Re-create the update policy to allow status changes to 'closed' (for closing) or 'pending' (for edits)
CREATE POLICY "Sellers can update their own listings"
  ON public.listings FOR UPDATE
  USING (seller_id = auth.uid())
  WITH CHECK (
    seller_id = auth.uid() AND
    status IN ('pending', 'closed')
  );
