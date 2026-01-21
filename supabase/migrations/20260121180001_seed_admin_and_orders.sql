-- Add admin role for antje@secretmenusf.com
-- This will be executed after the user signs up
-- For now, we create a function that can be called to set up admin

CREATE OR REPLACE FUNCTION setup_admin_user(admin_email TEXT)
RETURNS void AS $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Get user ID by email
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = admin_email;

  IF admin_user_id IS NOT NULL THEN
    -- Insert admin role if not exists
    INSERT INTO user_roles (user_id, role)
    VALUES (admin_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create Internet Backyard Inc organization
INSERT INTO organizations (id, name, billing_email, billing_contact_name, billing_method, notes)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Internet Backyard Inc',
  'internetbackyard@ap.ramp.com',
  'Mai',
  'ramp',
  'ACH payments via Ramp card ending in 7221'
)
ON CONFLICT DO NOTHING;

-- Create invoices for the 3 existing orders
INSERT INTO organization_invoices (id, organization_id, invoice_number, amount_cents, status, payment_method, payment_reference, paid_at, description, notes)
VALUES
  -- Order 1: Dec 29, 2025 - $1,039.50 via Ramp
  (
    'inv-0030-0000-0000-000000000001',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    '0030',
    103950,
    'paid',
    'ramp',
    'Ramp Card (···· 7221)',
    '2025-12-29 00:00:00+00',
    'Organic Meal Prep, Delivered Bi-Weekly',
    'First order - Ramp card payment'
  ),
  -- Order 2: Jan 7, 2026 - $1,050.00 via ACH
  (
    'inv-0777-0000-0000-000000000002',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    '777',
    105000,
    'paid',
    'ach',
    'ACH Direct deposit (···· 7221)',
    '2026-01-07 00:00:00+00',
    'Organic Meal Prep, Delivered Bi-Weekly',
    'Week 1 order - ACH payment'
  ),
  -- Order 3: Jan 14, 2026 - $140.00 via ACH (additional meals)
  (
    'inv-1112-0000-0000-000000000003',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    '1112',
    14000,
    'paid',
    'ach',
    'ACH Direct deposit (···· 7221)',
    '2026-01-14 00:00:00+00',
    'Additional Meals for Thursday (1/15) and Friday (1/16)',
    'Additional meals add-on'
  )
ON CONFLICT DO NOTHING;

-- Create orders linked to invoices
INSERT INTO orders (id, organization_id, invoice_id, status, payment_method, payment_status, total_cents, delivery_notes, admin_notes, created_at, updated_at)
VALUES
  -- Order 1: Dec 29, 2025
  (
    'ord-0030-0000-0000-000000000001',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'inv-0030-0000-0000-000000000001',
    'delivered',
    'ramp',
    'paid',
    103950,
    NULL,
    'First order for Internet Backyard Inc. Paid via Ramp card.',
    '2025-12-29 00:00:00+00',
    '2025-12-29 00:00:00+00'
  ),
  -- Order 2: Jan 7, 2026 (Week 1 - $1,050)
  (
    'ord-0777-0000-0000-000000000002',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'inv-0777-0000-0000-000000000002',
    'delivered',
    'ach',
    'paid',
    105000,
    NULL,
    'Week 1 regular delivery. Paid via ACH.',
    '2026-01-07 00:00:00+00',
    '2026-01-07 00:00:00+00'
  ),
  -- Order 3: Jan 14, 2026 (Additional meals - $140)
  (
    'ord-1112-0000-0000-000000000003',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'inv-1112-0000-0000-000000000003',
    'delivered',
    'ach',
    'paid',
    14000,
    'Additional meals for Thu 1/15 and Fri 1/16',
    'Additional meals add-on for Week 2. Paid via ACH.',
    '2026-01-14 00:00:00+00',
    '2026-01-14 00:00:00+00'
  )
ON CONFLICT DO NOTHING;

-- Add Mai as organization member (owner)
-- Note: user_id will be linked when Mai signs up with her email
INSERT INTO organization_members (organization_id, email, name, role, can_place_orders, can_customize_orders, can_view_invoices)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'internetbackyard@ap.ramp.com',
  'Mai',
  'owner',
  true,
  true,
  true
)
ON CONFLICT DO NOTHING;

-- Create a summary view for admin dashboard
CREATE OR REPLACE VIEW admin_orders_summary AS
SELECT
  o.id,
  o.created_at,
  o.updated_at,
  o.status,
  o.payment_status,
  o.payment_method,
  o.total_cents,
  o.delivery_notes,
  o.admin_notes,
  org.name as organization_name,
  org.billing_contact_name,
  org.billing_email,
  inv.invoice_number,
  inv.status as invoice_status,
  p.name as customer_name,
  p.email as customer_email
FROM orders o
LEFT JOIN organizations org ON o.organization_id = org.id
LEFT JOIN organization_invoices inv ON o.invoice_id = inv.id
LEFT JOIN profiles p ON o.user_id = p.id
ORDER BY o.created_at DESC;

-- Grant access to view
GRANT SELECT ON admin_orders_summary TO authenticated;
