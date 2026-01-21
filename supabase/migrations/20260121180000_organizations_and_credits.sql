-- Organizations/Households table
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  billing_email TEXT NOT NULL,
  billing_contact_name TEXT,
  billing_method TEXT DEFAULT 'stripe' CHECK (billing_method IN ('stripe', 'ramp', 'ach', 'invoice')),
  ramp_customer_id TEXT,
  stripe_customer_id TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Organization members (users belonging to organizations)
CREATE TABLE IF NOT EXISTS organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  can_place_orders BOOLEAN DEFAULT true,
  can_customize_orders BOOLEAN DEFAULT true,
  can_view_invoices BOOLEAN DEFAULT false,
  invite_token TEXT UNIQUE,
  invite_expires_at TIMESTAMPTZ,
  joined_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(organization_id, email)
);

-- Organization credits/subscriptions
CREATE TABLE IF NOT EXISTS organization_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  credit_type TEXT DEFAULT 'weekly' CHECK (credit_type IN ('weekly', 'one_time', 'rollover')),
  credits_amount_cents INTEGER NOT NULL DEFAULT 0,
  credits_remaining_cents INTEGER NOT NULL DEFAULT 0,
  valid_from DATE NOT NULL,
  valid_until DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Organization invoices
CREATE TABLE IF NOT EXISTS organization_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  invoice_number TEXT UNIQUE NOT NULL,
  amount_cents INTEGER NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  payment_method TEXT,
  payment_reference TEXT,
  due_date DATE,
  paid_at TIMESTAMPTZ,
  description TEXT,
  line_items JSONB,
  notes TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add organization_id to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_notes TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS line_items JSONB;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS invoice_id UUID REFERENCES organization_invoices(id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_org_members_org ON organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_members_user ON organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_org_members_email ON organization_members(email);
CREATE INDEX IF NOT EXISTS idx_org_credits_org ON organization_credits(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_invoices_org ON organization_invoices(organization_id);
CREATE INDEX IF NOT EXISTS idx_orders_org ON orders(organization_id);

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_invoices ENABLE ROW LEVEL SECURITY;

-- Policies for organizations
CREATE POLICY "Admins can manage all organizations"
  ON organizations FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Org members can view their organization"
  ON organizations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_id = organizations.id
      AND user_id = auth.uid()
    )
  );

-- Policies for organization_members
CREATE POLICY "Admins can manage all org members"
  ON organization_members FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Org owners/admins can manage members"
  ON organization_members FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = organization_members.organization_id
      AND om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Members can view their org's members"
  ON organization_members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = organization_members.organization_id
      AND om.user_id = auth.uid()
    )
  );

-- Policies for organization_credits
CREATE POLICY "Admins can manage all credits"
  ON organization_credits FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Org members can view their org credits"
  ON organization_credits FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = organization_credits.organization_id
      AND om.user_id = auth.uid()
    )
  );

-- Policies for organization_invoices
CREATE POLICY "Admins can manage all invoices"
  ON organization_invoices FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Org members with invoice access can view"
  ON organization_invoices FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = organization_invoices.organization_id
      AND om.user_id = auth.uid()
      AND (om.role IN ('owner', 'admin') OR om.can_view_invoices = true)
    )
  );

-- Update trigger for organizations
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Update trigger for invoices
CREATE TRIGGER update_org_invoices_updated_at
  BEFORE UPDATE ON organization_invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Function to generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  counter INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 4) AS INTEGER)), 0) + 1
  INTO counter
  FROM organization_invoices
  WHERE invoice_number LIKE 'INV%';

  new_number := 'INV' || LPAD(counter::TEXT, 6, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;
