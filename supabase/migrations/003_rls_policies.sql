-- Enable RLS on all tables (precautionary, already run in 001)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_transactions ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- PROFILES POLICIES
-- ==========================================

CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
  ON public.profiles FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Sellers can view buyer profiles for responses" 
  ON public.profiles FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.responses r
      JOIN public.listings l ON r.listing_id = l.id
      WHERE r.buyer_id = public.profiles.id AND l.seller_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own profile name" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND 
    -- Prevent changing role and tokens via standard SQL updates
    role = (SELECT role FROM public.profiles WHERE id = auth.uid()) AND
    tokens = (SELECT tokens FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ==========================================
-- LISTINGS POLICIES
-- ==========================================

CREATE POLICY "Anyone can view approved listings" 
  ON public.listings FOR SELECT 
  USING (status = 'approved');

CREATE POLICY "Sellers can view all of their own listings" 
  ON public.listings FOR SELECT 
  USING (seller_id = auth.uid());

CREATE POLICY "Admins can view all listings" 
  ON public.listings FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Sellers can insert their own listings" 
  ON public.listings FOR INSERT 
  WITH CHECK (
    seller_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'seller'
    )
  );

CREATE POLICY "Sellers can update their own pending/rejected listings" 
  ON public.listings FOR UPDATE 
  USING (seller_id = auth.uid())
  WITH CHECK (
    seller_id = auth.uid() AND
    -- Require listing status to revert to pending if modified by seller
    status = 'pending'
  );

CREATE POLICY "Admins can update any listing status" 
  ON public.listings FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Sellers can delete their own listings" 
  ON public.listings FOR DELETE 
  USING (seller_id = auth.uid());

CREATE POLICY "Admins can delete any listing" 
  ON public.listings FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ==========================================
-- RESPONSES POLICIES
-- ==========================================

CREATE POLICY "Sellers can view responses for their listings" 
  ON public.responses FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.listings 
      WHERE id = public.responses.listing_id AND seller_id = auth.uid()
    )
  );

CREATE POLICY "Buyers can view their own submitted responses" 
  ON public.responses FOR SELECT 
  USING (buyer_id = auth.uid());

CREATE POLICY "Admins can view all responses" 
  ON public.responses FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Anyone can submit response to approved listing" 
  ON public.responses FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.listings 
      WHERE id = listing_id AND status = 'approved'
    )
  );

-- ==========================================
-- TOKEN TRANSACTIONS POLICIES
-- ==========================================

CREATE POLICY "Users can view their own token transactions" 
  ON public.token_transactions FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all token transactions" 
  ON public.token_transactions FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
