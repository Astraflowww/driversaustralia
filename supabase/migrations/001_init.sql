-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Profiles Table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT,
  role        TEXT NOT NULL DEFAULT 'buyer' CHECK (role IN ('buyer', 'seller', 'admin')),
  tokens      INT NOT NULL DEFAULT 0 CHECK (tokens >= 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on profiles (enabled now, policies defined in 003_rls_policies.sql)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Create Listings Table
CREATE TABLE IF NOT EXISTS public.listings (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  description  TEXT,
  category     TEXT NOT NULL, -- e.g. 'driver', 'event', 'service', 'other'
  form_schema  JSONB NOT NULL, -- dynamic form fields definition
  status       TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on listings
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- 3. Create Responses Table
CREATE TABLE IF NOT EXISTS public.responses (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id   UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  buyer_id     UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  form_data    JSONB NOT NULL, -- buyer's filled answers
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on responses
ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;

-- 4. Create Token Transactions Table
CREATE TABLE IF NOT EXISTS public.token_transactions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  admin_id    UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  delta       INT NOT NULL, -- positive = add, negative = remove
  reason      TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on token_transactions
ALTER TABLE public.token_transactions ENABLE ROW LEVEL SECURITY;

-- 5. Trigger Function to automatically create profile on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  chosen_role text;
  initial_tokens int;
BEGIN
  -- Extract role from metadata, default to 'buyer'
  chosen_role := COALESCE(new.raw_user_meta_data->>'role', 'buyer');
  
  -- Validation check
  IF chosen_role NOT IN ('buyer', 'seller', 'admin') THEN
    chosen_role := 'buyer';
  END IF;
  
  -- Give new sellers 3 tokens to start, buyers get 0
  IF chosen_role = 'seller' THEN
    initial_tokens := 3;
  ELSE
    initial_tokens := 0;
  END IF;

  INSERT INTO public.profiles (id, email, full_name, role, tokens)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    chosen_role,
    initial_tokens
  );
  
  -- Log initial tokens if given to seller
  IF initial_tokens > 0 THEN
    INSERT INTO public.token_transactions (user_id, delta, reason)
    VALUES (new.id, initial_tokens, 'Sign-up registration bonus tokens');
  END IF;

  RETURN new;
EXCEPTION
  WHEN others THEN
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to hook into auth.users insert
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
