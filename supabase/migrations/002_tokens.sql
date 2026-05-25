-- Function to atomically spend 1 token for a seller when creating a listing
CREATE OR REPLACE FUNCTION public.spend_token(seller_id UUID)
RETURNS void AS $$
DECLARE
  current_tokens int;
BEGIN
  -- Check user's current token count
  SELECT tokens INTO current_tokens FROM public.profiles WHERE id = seller_id;
  
  IF current_tokens IS NULL THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;

  IF current_tokens < 1 THEN
    RAISE EXCEPTION 'Insufficient tokens';
  END IF;

  -- Deduct token
  UPDATE public.profiles
  SET tokens = tokens - 1
  WHERE id = seller_id;

  -- Log transaction
  INSERT INTO public.token_transactions (user_id, delta, reason)
  VALUES (seller_id, -1, 'Created new listing');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function for admins to atomically add/remove tokens for any user
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
  -- Check if admin_user_id is actually an admin
  SELECT role INTO admin_role FROM public.profiles WHERE id = admin_user_id;
  
  IF admin_role IS NULL OR admin_role != 'admin' THEN
    RAISE EXCEPTION 'Unauthorized: Only administrators can adjust tokens';
  END IF;

  -- Check if target user exists
  SELECT tokens INTO current_tokens FROM public.profiles WHERE id = target_user_id;
  IF current_tokens IS NULL THEN
    RAISE EXCEPTION 'Target user profile not found';
  END IF;

  -- Ensure we don't drop tokens below zero
  IF current_tokens + token_delta < 0 THEN
    RAISE EXCEPTION 'Cannot reduce tokens below zero. Current tokens: %', current_tokens;
  END IF;

  -- Update target user tokens
  UPDATE public.profiles
  SET tokens = tokens + token_delta
  WHERE id = target_user_id;

  -- Log the transaction
  INSERT INTO public.token_transactions (user_id, admin_id, delta, reason)
  VALUES (target_user_id, admin_user_id, token_delta, COALESCE(transaction_reason, 'Admin adjustment'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
