-- ══════════════════════════════════════════════════════════════════
-- ROHAH POS — RLS Policies
-- Paste di Supabase SQL Editor → Run
-- ══════════════════════════════════════════════════════════════════

-- Allow anon to verify PIN (read employees)
CREATE POLICY "Allow PIN login"
  ON employees FOR SELECT
  TO anon
  USING (active = true);

-- Allow anon to read menu items
CREATE POLICY "Allow read menu"
  ON menu_items FOR SELECT
  TO anon
  USING (active = true);

-- Allow anon to insert transactions
CREATE POLICY "Allow insert transactions"
  ON transactions FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anon to read transactions
CREATE POLICY "Allow read transactions"
  ON transactions FOR SELECT
  TO anon
  USING (true);

-- Allow anon to insert transaction items
CREATE POLICY "Allow insert transaction items"
  ON transaction_items FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anon to read transaction items
CREATE POLICY "Allow read transaction items"
  ON transaction_items FOR SELECT
  TO anon
  USING (true);

-- Allow anon to read customers
CREATE POLICY "Allow read customers"
  ON customers FOR SELECT
  TO anon
  USING (true);

-- Allow anon to upsert customers
CREATE POLICY "Allow upsert customers"
  ON customers FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow update customers"
  ON customers FOR UPDATE
  TO anon
  USING (true);
