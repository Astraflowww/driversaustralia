-- 1. Create SECURITY DEFINER functions to check roles without triggering RLS recursion
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_seller(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'seller'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop existing recursive policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;

DROP POLICY IF EXISTS "Admins can view all listings" ON public.listings;
DROP POLICY IF EXISTS "Sellers can insert their own listings" ON public.listings;
DROP POLICY IF EXISTS "Admins can update any listing status" ON public.listings;
DROP POLICY IF EXISTS "Admins can delete any listing" ON public.listings;

DROP POLICY IF EXISTS "Admins can view all responses" ON public.responses;

DROP POLICY IF EXISTS "Admins can view all token transactions" ON public.token_transactions;

-- 3. Recreate the policies using the security definer functions
CREATE POLICY "Admins can view all profiles" 
  ON public.profiles FOR SELECT 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can view all listings" 
  ON public.listings FOR SELECT 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Sellers can insert their own listings" 
  ON public.listings FOR INSERT 
  WITH CHECK (
    seller_id = auth.uid() AND
    public.is_seller(auth.uid())
  );

CREATE POLICY "Admins can update any listing status" 
  ON public.listings FOR UPDATE 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete any listing" 
  ON public.listings FOR DELETE 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can view all responses" 
  ON public.responses FOR SELECT 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can view all token transactions" 
  ON public.token_transactions FOR SELECT 
  USING (public.is_admin(auth.uid()));
