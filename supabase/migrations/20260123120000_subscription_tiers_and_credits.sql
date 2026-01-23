-- Subscription tiers and credits system
-- Migration for the new subscription model with AI credits

-- Add new columns to subscriptions table
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'member' CHECK (tier IN ('explorer', 'member', 'pro', 'developer', 'startup'));
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS credits_remaining_cents INTEGER DEFAULT 0;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS ai_messages_remaining INTEGER DEFAULT 0;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS current_period_start TIMESTAMPTZ;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMPTZ;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS cancel_at_period_end BOOLEAN DEFAULT false;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);

-- Create index for tier lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_tier ON subscriptions(tier);
CREATE INDEX IF NOT EXISTS idx_subscriptions_org ON subscriptions(organization_id);

-- Credit transactions table for tracking credit usage
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id),
  amount_cents INTEGER NOT NULL, -- positive = credit added, negative = credit used
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('subscription_grant', 'purchase', 'food_order', 'ai_usage', 'refund', 'adjustment')),
  description TEXT,
  related_order_id UUID REFERENCES orders(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_credit_transactions_user ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_subscription ON credit_transactions(subscription_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_type ON credit_transactions(transaction_type);

-- Enable RLS on credit_transactions
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own transactions
CREATE POLICY "Users can view own credit transactions"
  ON credit_transactions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Admins can manage all transactions
CREATE POLICY "Admins can manage all credit transactions"
  ON credit_transactions FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- City waitlist table for global expansion
CREATE TABLE IF NOT EXISTS city_waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_name TEXT NOT NULL,
  country TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  email TEXT NOT NULL,
  voted_at TIMESTAMPTZ DEFAULT now(),
  notified_at TIMESTAMPTZ,
  UNIQUE(city_name, country, email)
);

CREATE INDEX IF NOT EXISTS idx_city_waitlist_city ON city_waitlist(city_name, country);
CREATE INDEX IF NOT EXISTS idx_city_waitlist_email ON city_waitlist(email);

-- City votes aggregation view
CREATE OR REPLACE VIEW city_vote_counts AS
SELECT
  city_name,
  country,
  COUNT(*) as vote_count
FROM city_waitlist
GROUP BY city_name, country
ORDER BY vote_count DESC;

-- Enable RLS on city_waitlist
ALTER TABLE city_waitlist ENABLE ROW LEVEL SECURITY;

-- Anyone can add to waitlist
CREATE POLICY "Anyone can join waitlist"
  ON city_waitlist FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Users can view their own waitlist entries
CREATE POLICY "Users can view own waitlist entries"
  ON city_waitlist FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR user_id IS NULL);

-- Admins can manage waitlist
CREATE POLICY "Admins can manage waitlist"
  ON city_waitlist FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- Function to grant subscription credits on period start
CREATE OR REPLACE FUNCTION grant_subscription_credits()
RETURNS TRIGGER AS $$
DECLARE
  credits_to_grant INTEGER;
  ai_messages_to_grant INTEGER;
BEGIN
  -- Determine credits based on tier
  CASE NEW.tier
    WHEN 'explorer' THEN
      credits_to_grant := 0;
      ai_messages_to_grant := 50;
    WHEN 'member' THEN
      credits_to_grant := 0;
      ai_messages_to_grant := 100;
    WHEN 'pro' THEN
      credits_to_grant := 5000; -- $50
      ai_messages_to_grant := 200;
    WHEN 'developer' THEN
      credits_to_grant := 35000; -- $350
      ai_messages_to_grant := -1; -- unlimited
    WHEN 'startup' THEN
      credits_to_grant := 90000; -- $900
      ai_messages_to_grant := -1; -- unlimited
    ELSE
      credits_to_grant := 0;
      ai_messages_to_grant := 0;
  END CASE;

  -- Update credits
  NEW.credits_remaining_cents := COALESCE(NEW.credits_remaining_cents, 0) + credits_to_grant;
  NEW.ai_messages_remaining := ai_messages_to_grant;

  -- Log the transaction
  IF credits_to_grant > 0 THEN
    INSERT INTO credit_transactions (user_id, subscription_id, amount_cents, transaction_type, description)
    VALUES (NEW.user_id, NEW.id, credits_to_grant, 'subscription_grant', 'Monthly subscription credit grant for ' || NEW.tier || ' tier');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to grant credits on new subscription or tier change
DROP TRIGGER IF EXISTS trigger_grant_subscription_credits ON subscriptions;
CREATE TRIGGER trigger_grant_subscription_credits
  BEFORE INSERT OR UPDATE OF tier ON subscriptions
  FOR EACH ROW
  WHEN (NEW.status = 'active' AND (TG_OP = 'INSERT' OR OLD.tier IS DISTINCT FROM NEW.tier))
  EXECUTE FUNCTION grant_subscription_credits();

-- Function to use credits
CREATE OR REPLACE FUNCTION use_credits(
  p_user_id UUID,
  p_amount_cents INTEGER,
  p_transaction_type TEXT,
  p_description TEXT DEFAULT NULL,
  p_order_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_subscription RECORD;
BEGIN
  -- Get active subscription with sufficient credits
  SELECT * INTO v_subscription
  FROM subscriptions
  WHERE user_id = p_user_id
    AND status = 'active'
    AND credits_remaining_cents >= p_amount_cents
  ORDER BY created_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  -- Deduct credits
  UPDATE subscriptions
  SET credits_remaining_cents = credits_remaining_cents - p_amount_cents
  WHERE id = v_subscription.id;

  -- Log transaction
  INSERT INTO credit_transactions (user_id, subscription_id, amount_cents, transaction_type, description, related_order_id)
  VALUES (p_user_id, v_subscription.id, -p_amount_cents, p_transaction_type, p_description, p_order_id);

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
