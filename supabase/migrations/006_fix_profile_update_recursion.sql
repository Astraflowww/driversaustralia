-- 1. Create a SECURITY DEFINER function to check if role/tokens are unchanged without triggering RLS recursion
CREATE OR REPLACE FUNCTION public.check_profile_update(
  user_id uuid,
  new_role text,
  new_tokens int
)
RETURNS boolean AS $$
DECLARE
  old_role text;
  old_tokens int;
BEGIN
  -- Fetch the existing values directly from public.profiles (bypasses RLS due to SECURITY DEFINER)
  SELECT role, tokens INTO old_role, old_tokens
  FROM public.profiles
  WHERE id = user_id;

  -- If profile doesn't exist yet, allow the operation
  IF old_role IS NULL THEN
    RETURN true;
  END IF;

  -- Return true if role and tokens remain unchanged
  RETURN (new_role = old_role AND new_tokens = old_tokens);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop the recursive update policy
DROP POLICY IF EXISTS "Users can update their own profile name" ON public.profiles;

-- 3. Recreate the update policy using the security definer check function
CREATE POLICY "Users can update their own profile name"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    public.check_profile_update(id, role, tokens)
  );
