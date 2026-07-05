-- Setup Database from Scratch
-- Combined setup migration for Profiles, Listings, Responses, Tokens, Messaging, and System Settings

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. TABLE CREATIONS
-- ==========================================

-- TABLE: profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id                  UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email               TEXT NOT NULL,
  full_name           TEXT,
  role                TEXT NOT NULL DEFAULT 'buyer' CHECK (role IN ('buyer', 'seller', 'admin')),
  tokens              INT NOT NULL DEFAULT 0 CHECK (tokens >= 0),
  phone               TEXT,
  address             TEXT,
  business_name       TEXT,
  business_phone      TEXT,
  abn                 TEXT,
  business_address    TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLE: listings
CREATE TABLE IF NOT EXISTS public.listings (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title               TEXT NOT NULL,
  description         TEXT,
  category            TEXT NOT NULL, -- e.g. 'driver', 'event', 'service', 'other'
  form_schema         JSONB NOT NULL, -- dynamic form fields definition
  status              TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'closed')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLE: responses
CREATE TABLE IF NOT EXISTS public.responses (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id          UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  buyer_id            UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  form_data           JSONB NOT NULL, -- buyer's filled answers
  status              TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLE: token_transactions
CREATE TABLE IF NOT EXISTS public.token_transactions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  admin_id            UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  delta               INT NOT NULL, -- positive = add, negative = remove
  reason              TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLE: conversations
CREATE TABLE IF NOT EXISTS public.conversations (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id          UUID REFERENCES public.listings(id) ON DELETE SET NULL,
  participant_1       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  participant_2       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  is_starred_p1       BOOLEAN NOT NULL DEFAULT FALSE,
  is_starred_p2       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(listing_id, participant_1, participant_2),
  CHECK (participant_1 != participant_2)
);

-- TABLE: messages
CREATE TABLE IF NOT EXISTS public.messages (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id     UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content             TEXT NOT NULL CHECK (char_length(content) > 0 AND char_length(content) <= 5000),
  is_read             BOOLEAN NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLE: system_settings
CREATE TABLE IF NOT EXISTS public.system_settings (
  key                 TEXT PRIMARY KEY,
  value               JSONB NOT NULL,
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- 2. INDEX CREATIONS
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_messages_conversation_time ON public.messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON public.messages(conversation_id, is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_conversations_p1 ON public.conversations(participant_1, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_p2 ON public.conversations(participant_2, updated_at DESC);

-- ==========================================
-- 3. ENABLE ROW LEVEL SECURITY
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 4. SECURITY DEFINER HELPER FUNCTIONS (Avoid RLS Recursion)
-- ==========================================

-- Check if user is administrator
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is seller
CREATE OR REPLACE FUNCTION public.is_seller(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'seller'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if role and tokens remain unchanged during self-updates
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
  SELECT role, tokens INTO old_role, old_tokens
  FROM public.profiles
  WHERE id = user_id;

  IF old_role IS NULL THEN
    RETURN true;
  END IF;

  RETURN (new_role = old_role AND new_tokens = old_tokens);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 5. ROW LEVEL SECURITY POLICIES
-- ==========================================

-- POLICY: profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
  ON public.profiles FOR SELECT 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Sellers can view buyer profiles for responses" 
  ON public.profiles FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.responses r
      JOIN public.listings l ON r.listing_id = l.id
      WHERE r.buyer_id = public.profiles.id AND l.seller_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view profiles of sellers with approved listings"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.listings
      WHERE seller_id = public.profiles.id AND status = 'approved'
    )
  );

CREATE POLICY "Users can update their own profile name"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    public.check_profile_update(id, role, tokens)
  );

CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- POLICY: listings
CREATE POLICY "Anyone can view approved listings" 
  ON public.listings FOR SELECT 
  USING (status = 'approved');

CREATE POLICY "Sellers can view all of their own listings" 
  ON public.listings FOR SELECT 
  USING (seller_id = auth.uid());

CREATE POLICY "Admins can view all listings" 
  ON public.listings FOR SELECT 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Sellers can insert their own listings" 
  ON public.listings FOR INSERT 
  WITH CHECK (
    seller_id = auth.uid() AND
    public.is_seller(auth.uid())
  );

CREATE POLICY "Sellers can update their own listings"
  ON public.listings FOR UPDATE
  USING (seller_id = auth.uid())
  WITH CHECK (
    seller_id = auth.uid() AND
    status IN ('pending', 'closed')
  );

CREATE POLICY "Admins can update any listing status" 
  ON public.listings FOR UPDATE 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Sellers can delete their own listings" 
  ON public.listings FOR DELETE 
  USING (seller_id = auth.uid());

CREATE POLICY "Admins can delete any listing" 
  ON public.listings FOR DELETE 
  USING (public.is_admin(auth.uid()));

-- POLICY: responses
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
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Anyone can submit response to approved listing" 
  ON public.responses FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.listings 
      WHERE id = listing_id AND status = 'approved'
    )
  );

CREATE POLICY "Sellers can update responses for their listings"
  ON public.responses FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.listings
      WHERE id = public.responses.listing_id AND seller_id = auth.uid()
    )
  );

-- POLICY: token_transactions
CREATE POLICY "Users can view their own token transactions" 
  ON public.token_transactions FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all token transactions" 
  ON public.token_transactions FOR SELECT 
  USING (public.is_admin(auth.uid()));

-- POLICY: conversations
CREATE POLICY "Users can view their conversations"
  ON public.conversations FOR SELECT
  USING (auth.uid() = participant_1 OR auth.uid() = participant_2);

CREATE POLICY "Admins can view all conversations"
  ON public.conversations FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can create conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (auth.uid() = participant_1 OR auth.uid() = participant_2);

CREATE POLICY "Users can update their conversations"
  ON public.conversations FOR UPDATE
  USING (auth.uid() = participant_1 OR auth.uid() = participant_2);

-- POLICY: messages
CREATE POLICY "Users can view messages in their conversations"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = messages.conversation_id
      AND (c.participant_1 = auth.uid() OR c.participant_2 = auth.uid())
    )
  );

CREATE POLICY "Admins can view all messages"
  ON public.messages FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can send messages in their conversations"
  ON public.messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = messages.conversation_id
      AND (c.participant_1 = auth.uid() OR c.participant_2 = auth.uid())
    )
  );

CREATE POLICY "Users can mark messages as read"
  ON public.messages FOR UPDATE
  USING (
    sender_id != auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = messages.conversation_id
      AND (c.participant_1 = auth.uid() OR c.participant_2 = auth.uid())
    )
  );

-- POLICY: system_settings
CREATE POLICY "Allow public read access to settings"
  ON public.system_settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow admins all access to settings"
  ON public.system_settings FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- ==========================================
-- 6. DYNAMIC PROCEDURES & AUTOMATIONS
-- ==========================================

-- TRIGGER FUNCTION: handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  chosen_role text;
  initial_tokens int;
BEGIN
  chosen_role := COALESCE(new.raw_user_meta_data->>'role', 'buyer');
  
  IF chosen_role NOT IN ('buyer', 'seller', 'admin') THEN
    chosen_role := 'buyer';
  END IF;
  
  IF chosen_role = 'seller' THEN
    initial_tokens := 3;
  ELSE
    initial_tokens := 0;
  END IF;

  INSERT INTO public.profiles (id, email, full_name, role, tokens, phone, address)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    chosen_role,
    initial_tokens,
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    COALESCE(new.raw_user_meta_data->>'address', '')
  );
  
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

-- TRIGGER: on_auth_user_created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- FUNCTION: spend_token (Atomic token deduction for seller listing creations)
CREATE OR REPLACE FUNCTION public.spend_token(seller_id UUID)
RETURNS void AS $$
DECLARE
  current_tokens int;
BEGIN
  SELECT tokens INTO current_tokens FROM public.profiles WHERE id = seller_id;
  
  IF current_tokens IS NULL THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;

  IF current_tokens < 1 THEN
    RAISE EXCEPTION 'Insufficient tokens';
  END IF;

  UPDATE public.profiles
  SET tokens = tokens - 1
  WHERE id = seller_id;

  INSERT INTO public.token_transactions (user_id, delta, reason)
  VALUES (seller_id, -1, 'Created new listing');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- FUNCTION: adjust_user_tokens (Atomic admin adjustments with audit logging)
CREATE OR REPLACE FUNCTION public.adjust_user_tokens(
  target_user_id UUID,
  admin_user_id UUID,
  token_delta INT,
  transaction_reason TEXT
)
RETURNS void AS $$
DECLARE
  admin_role text;
  current_tokens int;
BEGIN
  SELECT role INTO admin_role FROM public.profiles WHERE id = admin_user_id;
  
  IF admin_role IS NULL OR admin_role != 'admin' THEN
    RAISE EXCEPTION 'Unauthorized: Only administrators can adjust tokens';
  END IF;

  SELECT tokens INTO current_tokens FROM public.profiles WHERE id = target_user_id;
  IF current_tokens IS NULL THEN
    RAISE EXCEPTION 'Target user profile not found';
  END IF;

  IF current_tokens + token_delta < 0 THEN
    RAISE EXCEPTION 'Cannot reduce tokens below zero. Current tokens: %', current_tokens;
  END IF;

  UPDATE public.profiles
  SET tokens = tokens + token_delta
  WHERE id = target_user_id;

  INSERT INTO public.token_transactions (user_id, admin_id, delta, reason)
  VALUES (target_user_id, admin_user_id, token_delta, COALESCE(transaction_reason, 'Admin adjustment'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- TRIGGER FUNCTION: update_conversation_timestamp
CREATE OR REPLACE FUNCTION public.update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations SET updated_at = NOW() WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- TRIGGER: on_new_message
CREATE TRIGGER on_new_message
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_conversation_timestamp();

-- FUNCTION: get_or_create_conversation
CREATE OR REPLACE FUNCTION public.get_or_create_conversation(
  p_listing_id UUID,
  p_other_user_id UUID
) RETURNS UUID AS $$
DECLARE
  v_conversation_id UUID;
  v_user_id UUID := auth.uid();
  v_p1 UUID;
  v_p2 UUID;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF v_user_id = p_other_user_id THEN
    RAISE EXCEPTION 'Cannot create conversation with yourself';
  END IF;

  IF v_user_id < p_other_user_id THEN
    v_p1 := v_user_id;
    v_p2 := p_other_user_id;
  ELSE
    v_p1 := p_other_user_id;
    v_p2 := v_user_id;
  END IF;

  SELECT id INTO v_conversation_id
  FROM public.conversations
  WHERE listing_id = p_listing_id
    AND participant_1 = v_p1
    AND participant_2 = v_p2;

  IF v_conversation_id IS NULL THEN
    INSERT INTO public.conversations (listing_id, participant_1, participant_2)
    VALUES (p_listing_id, v_p1, v_p2)
    RETURNING id INTO v_conversation_id;
  END IF;

  RETURN v_conversation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 7. SEEDING SYSTEM PREFERENCES
-- ==========================================

INSERT INTO public.system_settings (key, value)
VALUES 
  ('signup_tokens', '5'::jsonb),
  ('listing_token_cost', '1'::jsonb),
  ('site_name', '"Drivers Australia"'::jsonb),
  ('support_email', '"support@driversaustralia.com.au"'::jsonb),
  ('maintenance_mode', 'false'::jsonb)
ON CONFLICT (key) DO NOTHING;
