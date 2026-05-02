-- ══════════════════════════════════════════════════════════════════
-- ROHAH POS — Database Schema
-- Paste di Supabase SQL Editor → Run
-- ══════════════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── EMPLOYEES ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS employees (
  id         BIGSERIAL PRIMARY KEY,
  name       TEXT        NOT NULL,
  role       TEXT        NOT NULL CHECK (role IN ('owner', 'manager', 'admin', 'kasir')),
  pin        TEXT        NOT NULL,
  active     BOOLEAN     NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── MENU ITEMS ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS menu_items (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT        NOT NULL,
  category    TEXT        NOT NULL,
  price       INTEGER     NOT NULL CHECK (price >= 0),
  emoji       TEXT        NOT NULL DEFAULT '🍽️',
  description TEXT,
  active      BOOLEAN     NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── TRANSACTIONS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS transactions (
  id               BIGSERIAL PRIMARY KEY,
  cashier_name     TEXT,
  customer_name    TEXT,
  order_type       TEXT        NOT NULL DEFAULT 'dine_in' CHECK (order_type IN ('dine_in', 'take_away')),
  table_id         INTEGER,
  subtotal         INTEGER     NOT NULL DEFAULT 0,
  discount         INTEGER     NOT NULL DEFAULT 0,
  tax              INTEGER     NOT NULL DEFAULT 0,
  total            INTEGER     NOT NULL DEFAULT 0,
  payment_method   TEXT        NOT NULL DEFAULT 'cash' CHECK (payment_method IN ('cash', 'qris', 'debit', 'transfer')),
  cash_received    INTEGER,
  change_given     INTEGER,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── TRANSACTION ITEMS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS transaction_items (
  id             BIGSERIAL PRIMARY KEY,
  transaction_id BIGINT      NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  menu_item_id   BIGINT      REFERENCES menu_items(id) ON DELETE SET NULL,
  name           TEXT        NOT NULL,
  price          INTEGER     NOT NULL,
  qty            INTEGER     NOT NULL CHECK (qty > 0)
);

-- ── CUSTOMERS ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS customers (
  id           BIGSERIAL PRIMARY KEY,
  name         TEXT        NOT NULL,
  phone        TEXT        UNIQUE NOT NULL,
  email        TEXT,
  points       INTEGER     NOT NULL DEFAULT 0,
  tier         TEXT        NOT NULL DEFAULT 'Bronze' CHECK (tier IN ('Bronze', 'Silver', 'Gold', 'Platinum')),
  visits       INTEGER     NOT NULL DEFAULT 0,
  last_visit   DATE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE employees         ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items        ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers         ENABLE ROW LEVEL SECURITY;
