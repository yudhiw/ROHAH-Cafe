// ═══════════════════════════════════════════════════════════════
// ROHAH POS — Supabase Configuration
// Paste your Supabase Project URL and Anon Key below
// ═══════════════════════════════════════════════════════════════

const SUPABASE_URL  = "https://xlcbrjokyqzlyxdyvanp.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsY2Jyam9reXF6bHl4ZHl2YW5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNDUwODUsImV4cCI6MjA3ODYyMTA4NX0.bB7xtemyZEisKKkki-qTRMZY2i6Ig4fymYVYIkhBZ78";

// ─── DATABASE SCHEMA (run this SQL in Supabase SQL Editor) ───────────────
/*

-- 1. EMPLOYEES (accounts for POS login)
create table employees (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text check (role in ('kasir','admin','manager','owner')) not null,
  pin text not null,          -- store hashed in production
  avatar text,
  active boolean default true,
  created_at timestamptz default now()
);

-- 2. MENU ITEMS
create table menu_items (
  id serial primary key,
  name text not null,
  category text not null,
  price integer not null,
  emoji text,
  description text,
  active boolean default true,
  stock integer default 999,
  created_at timestamptz default now()
);

-- 3. TRANSACTIONS
create table transactions (
  id uuid primary key default gen_random_uuid(),
  order_no text not null,
  cashier_id uuid references employees(id),
  customer_name text,
  table_no text,
  order_type text check (order_type in ('Dine In','Take Away')),
  subtotal integer not null,
  tax integer not null,
  discount integer default 0,
  total integer not null,
  pay_method text,
  status text default 'paid',
  created_at timestamptz default now()
);

-- 4. TRANSACTION ITEMS
create table transaction_items (
  id serial primary key,
  transaction_id uuid references transactions(id) on delete cascade,
  menu_item_id integer references menu_items(id),
  name text not null,
  price integer not null,
  qty integer not null
);

-- 5. CUSTOMERS (loyalty)
create table customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text unique,
  points integer default 0,
  tier text default 'Bronze',
  visits integer default 0,
  last_visit date,
  created_at timestamptz default now()
);

-- Enable Row Level Security (optional but recommended)
alter table employees enable row level security;
alter table menu_items enable row level security;
alter table transactions enable row level security;
alter table customers enable row level security;

*/

// ─── Supabase DB Service ──────────────────────────────────────────────────
const USE_SUPABASE = SUPABASE_URL !== "YOUR_SUPABASE_URL";

let supabaseClient = null;

function initSupabase() {
  if (!USE_SUPABASE) {
    console.warn("[ROHAH POS] Supabase not configured — running in demo mode (localStorage).");
    return;
  }
  if (typeof supabase !== "undefined") {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
    console.log("[ROHAH POS] Supabase connected ✓");
  }
}

// ─── Generic DB helpers ───────────────────────────────────────────────────
const DB = {

  // EMPLOYEES
  async getEmployees() {
    if (!supabaseClient) return localDB.getEmployees();
    const { data, error } = await supabaseClient.from("employees").select("*").eq("active", true);
    if (error) throw error;
    return data;
  },

  async verifyPin(role, pin) {
    if (!supabaseClient) return localDB.verifyPin(role, pin);
    const { data, error } = await supabaseClient
      .from("employees").select("*").eq("role", role).eq("pin", pin).eq("active", true).single();
    if (error) return null;
    return data;
  },

  async createEmployee(emp) {
    if (!supabaseClient) return localDB.createEmployee(emp);
    const { data, error } = await supabaseClient.from("employees").insert(emp).select().single();
    if (error) throw error;
    return data;
  },

  async updateEmployee(id, updates) {
    if (!supabaseClient) return localDB.updateEmployee(id, updates);
    const { data, error } = await supabaseClient.from("employees").update(updates).eq("id", id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteEmployee(id) {
    if (!supabaseClient) return localDB.deleteEmployee(id);
    const { error } = await supabaseClient.from("employees").update({ active: false }).eq("id", id);
    if (error) throw error;
  },

  // MENU ITEMS
  async getMenuItems() {
    if (!supabaseClient) return localDB.getMenuItems();
    const { data, error } = await supabaseClient.from("menu_items").select("*").order("category").order("id");
    if (error) throw error;
    return data;
  },

  async createMenuItem(item) {
    if (!supabaseClient) return localDB.createMenuItem(item);
    const { data, error } = await supabaseClient.from("menu_items").insert(item).select().single();
    if (error) throw error;
    return data;
  },

  async updateMenuItem(id, updates) {
    if (!supabaseClient) return localDB.updateMenuItem(id, updates);
    const { data, error } = await supabaseClient.from("menu_items").update(updates).eq("id", id).select().single();
    if (error) throw error;
    return data;
  },

  // TRANSACTIONS
  async saveTransaction(txn, items) {
    if (!supabaseClient) return localDB.saveTransaction(txn, items);
    const { data: txData, error: txError } = await supabaseClient.from("transactions").insert(txn).select().single();
    if (txError) throw txError;
    const itemsWithId = items.map(i => ({ ...i, transaction_id: txData.id }));
    const { error: itError } = await supabaseClient.from("transaction_items").insert(itemsWithId);
    if (itError) throw itError;
    return txData;
  },

  async getTransactions(limit = 50) {
    if (!supabaseClient) return localDB.getTransactions(limit);
    const { data, error } = await supabaseClient
      .from("transactions").select("*, transaction_items(*)").order("created_at", { ascending: false }).limit(limit);
    if (error) throw error;
    return data;
  },

  // CUSTOMERS
  async getCustomers() {
    if (!supabaseClient) return localDB.getCustomers();
    const { data, error } = await supabaseClient.from("customers").select("*").order("points", { ascending: false });
    if (error) throw error;
    return data;
  },

  async upsertCustomer(customer) {
    if (!supabaseClient) return localDB.upsertCustomer(customer);
    const { data, error } = await supabaseClient.from("customers").upsert(customer, { onConflict: "phone" }).select().single();
    if (error) throw error;
    return data;
  },
};

// ─── LOCAL DB (demo/fallback) ─────────────────────────────────────────────
const localDB = {
  _load(key, def) {
    try { return JSON.parse(localStorage.getItem("rohah_" + key)) || def; }
    catch { return def; }
  },
  _save(key, val) { localStorage.setItem("rohah_" + key, JSON.stringify(val)); },

  getEmployees() {
    return this._load("employees", [
      { id:"e1", name:"Admin Rohah",   role:"admin",   pin:"2222", active:true },
      { id:"e2", name:"Kasir 1",       role:"kasir",   pin:"1111", active:true },
      { id:"e3", name:"Manager Rohah", role:"manager", pin:"3333", active:true },
      { id:"e4", name:"Owner",         role:"owner",   pin:"0000", active:true },
    ]);
  },

  verifyPin(role, pin) {
    const emps = this.getEmployees();
    return emps.find(e => e.role === role && e.pin === pin && e.active) || null;
  },

  createEmployee(emp) {
    const emps = this.getEmployees();
    const newEmp = { ...emp, id: "e" + Date.now(), active: true };
    emps.push(newEmp);
    this._save("employees", emps);
    return newEmp;
  },

  updateEmployee(id, updates) {
    const emps = this.getEmployees();
    const idx = emps.findIndex(e => e.id === id);
    if (idx >= 0) { emps[idx] = { ...emps[idx], ...updates }; this._save("employees", emps); return emps[idx]; }
    return null;
  },

  deleteEmployee(id) {
    const emps = this.getEmployees();
    const idx = emps.findIndex(e => e.id === id);
    if (idx >= 0) { emps[idx].active = false; this._save("employees", emps); }
  },

  getMenuItems() { return []; }, // uses MENU_DATA constant
  createMenuItem(item) { return item; },
  updateMenuItem(id, u) { return u; },

  saveTransaction(txn, items) {
    const txns = this._load("transactions", []);
    const saved = { ...txn, id: "txn-" + Date.now(), items, created_at: new Date().toISOString() };
    txns.unshift(saved);
    this._save("transactions", txns.slice(0, 200));
    return saved;
  },

  getTransactions(limit) { return this._load("transactions", []).slice(0, limit); },

  getCustomers() {
    return this._load("customers", [
      { id:"c1", name:"Budi Santoso",   phone:"0812-3456-7890", points:2840, tier:"Gold",     visits:47, last_visit:"2026-04-30" },
      { id:"c2", name:"Sari Dewi",      phone:"0813-2345-6789", points:1200, tier:"Silver",   visits:22, last_visit:"2026-05-01" },
      { id:"c3", name:"Ahmad Fauzi",    phone:"0821-4567-8901", points:4500, tier:"Platinum", visits:76, last_visit:"2026-05-01" },
      { id:"c4", name:"Rina Putri",     phone:"0857-3456-7890", points:350,  tier:"Bronze",   visits:8,  last_visit:"2026-04-28" },
      { id:"c5", name:"Dodi Prasetyo",  phone:"0878-2345-6789", points:1800, tier:"Silver",   visits:31, last_visit:"2026-04-30" },
    ]);
  },

  upsertCustomer(customer) {
    const custs = this.getCustomers();
    const idx = custs.findIndex(c => c.phone === customer.phone);
    if (idx >= 0) { custs[idx] = { ...custs[idx], ...customer }; }
    else { custs.push({ ...customer, id: "c" + Date.now() }); }
    this._save("customers", custs);
    return customer;
  },
};

window.ROHAH_DB = DB;
window.initSupabase = initSupabase;
window.localDB = localDB;
window.USE_SUPABASE = USE_SUPABASE;
