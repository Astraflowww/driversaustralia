-- Create policy to allow public read access to profiles of sellers who have approved listings.
-- This ensures that buyers and visitors can view the seller's business/full name on active listings.
CREATE POLICY "Anyone can view profiles of sellers with approved listings"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.listings
      WHERE seller_id = public.profiles.id AND status = 'approved'
    )
  );
