-- SF Secret Menu - Referral System Migration
-- Adds referral tracking to enable member invitations with 10 friend limit

-- Add referral columns to profiles table
ALTER TABLE public.profiles
  ADD COLUMN referral_code VARCHAR(20) UNIQUE,
  ADD COLUMN referred_by UUID REFERENCES public.profiles(id),
  ADD COLUMN invites_remaining INTEGER DEFAULT 10 NOT NULL;

-- Create index for referral code lookups
CREATE INDEX idx_profiles_referral_code ON public.profiles(referral_code);

-- Create referral status enum
CREATE TYPE public.referral_status AS ENUM ('pending', 'signed_up', 'first_order', 'active');

-- Create referrals tracking table
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referred_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  referral_code VARCHAR(20) NOT NULL,
  status referral_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  signed_up_at TIMESTAMPTZ,
  first_order_at TIMESTAMPTZ
);

-- Create indexes for efficient lookups
CREATE INDEX idx_referrals_referrer ON public.referrals(referrer_id);
CREATE INDEX idx_referrals_code ON public.referrals(referral_code);
CREATE INDEX idx_referrals_referred ON public.referrals(referred_id);

-- Enable RLS on referrals table
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Referrals policies
-- Users can view their own referrals (as referrer)
CREATE POLICY "Users can view their own referrals"
  ON public.referrals FOR SELECT
  USING (auth.uid() = referrer_id);

-- Users can view referrals where they were referred
CREATE POLICY "Users can view referral where they were referred"
  ON public.referrals FOR SELECT
  USING (auth.uid() = referred_id);

-- Admins can view all referrals
CREATE POLICY "Admins can view all referrals"
  ON public.referrals FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can manage all referrals
CREATE POLICY "Admins can manage all referrals"
  ON public.referrals FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Function to generate a referral code from user name
CREATE OR REPLACE FUNCTION public.generate_referral_code(user_name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  base_code TEXT;
  random_suffix TEXT;
  final_code TEXT;
  attempts INTEGER := 0;
BEGIN
  -- Take first part of name, uppercase, max 6 chars
  base_code := UPPER(REGEXP_REPLACE(COALESCE(SPLIT_PART(user_name, ' ', 1), 'GUEST'), '[^A-Z]', '', 'g'));
  base_code := SUBSTRING(base_code FROM 1 FOR 6);

  -- If name is too short, pad it
  IF LENGTH(base_code) < 3 THEN
    base_code := 'USER';
  END IF;

  -- Try to generate unique code (up to 10 attempts)
  LOOP
    -- Generate 4 random alphanumeric chars
    random_suffix := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4));
    final_code := base_code || random_suffix;

    -- Check if unique
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE referral_code = final_code) THEN
      RETURN final_code;
    END IF;

    attempts := attempts + 1;
    IF attempts >= 10 THEN
      -- Fallback to full random
      RETURN 'REF' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 7));
    END IF;
  END LOOP;
END;
$$;

-- Function to process referral on signup
CREATE OR REPLACE FUNCTION public.process_referral(
  referred_user_id UUID,
  referrer_code VARCHAR(20)
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  referrer_profile RECORD;
BEGIN
  -- Find the referrer by their code
  SELECT id, invites_remaining INTO referrer_profile
  FROM public.profiles
  WHERE referral_code = UPPER(referrer_code);

  -- If no referrer found or no invites remaining, return false
  IF referrer_profile IS NULL OR referrer_profile.invites_remaining <= 0 THEN
    RETURN FALSE;
  END IF;

  -- Update the referred user's profile
  UPDATE public.profiles
  SET referred_by = referrer_profile.id
  WHERE id = referred_user_id;

  -- Decrement referrer's invites
  UPDATE public.profiles
  SET invites_remaining = invites_remaining - 1
  WHERE id = referrer_profile.id;

  -- Create or update referral record
  INSERT INTO public.referrals (referrer_id, referred_id, referral_code, status, signed_up_at)
  VALUES (referrer_profile.id, referred_user_id, UPPER(referrer_code), 'signed_up', NOW())
  ON CONFLICT DO NOTHING;

  RETURN TRUE;
END;
$$;

-- Update handle_new_user to generate referral code
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_name TEXT;
  ref_code TEXT;
BEGIN
  user_name := NEW.raw_user_meta_data ->> 'name';
  ref_code := public.generate_referral_code(user_name);

  INSERT INTO public.profiles (id, email, name, referral_code, invites_remaining)
  VALUES (NEW.id, NEW.email, user_name, ref_code, 10);

  RETURN NEW;
END;
$$;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.generate_referral_code(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.process_referral(UUID, VARCHAR) TO authenticated;
