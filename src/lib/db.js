import { supabase, isConfigured } from './supabase'
import { ALL_ITEMS } from '../data/menu'

// ─── LocalDB fallback using localStorage ───────────────────────────────────
const KEY = (k) => `rohah_${k}`

const DEFAULT_EMPLOYEES = [
  { id: 1, name: 'Owner ROHAH',   role: 'owner',   pin: '0000', active: true },
  { id: 2, name: 'Manager ROHAH', role: 'manager', pin: '3333', active: true },
  { id: 3, name: 'Admin ROHAH',   role: 'admin',   pin: '2222', active: true },
  { id: 4, name: 'Kasir 1',       role: 'kasir',   pin: '1111', active: true },
  { id: 5, name: 'Kasir 2',       role: 'kasir',   pin: '1234', active: true },
]

const DEFAULT_CUSTOMERS = [
  { id: 1, name: 'Budi Santoso',  phone: '0812-3456-7890', points: 2840, tier: 'Gold',     visits: 47, last_visit: '2026-04-30' },
  { id: 2, name: 'Sari Dewi',     phone: '0813-2345-6789', points: 1200, tier: 'Silver',   visits: 22, last_visit: '2026-05-01' },
  { id: 3, name: 'Ahmad Fauzi',   phone: '0821-4567-8901', points: 4500, tier: 'Platinum', visits: 76, last_visit: '2026-05-01' },
  { id: 4, name: 'Rina Putri',    phone: '0857-3456-7890', points:  350, tier: 'Bronze',   visits:  8, last_visit: '2026-04-28' },
  { id: 5, name: 'Dodi Prasetyo', phone: '0878-2345-6789', points: 1800, tier: 'Silver',   visits: 31, last_visit: '2026-04-30' },
]

function lsGet(key, def) {
  try {
    const v = localStorage.getItem(KEY(key))
    return v ? JSON.parse(v) : def
  } catch { return def }
}
function lsSet(key, val) {
  try { localStorage.setItem(KEY(key), JSON.stringify(val)) } catch {}
}

const localDB = {
  getEmployees() {
    return lsGet('employees', DEFAULT_EMPLOYEES)
  },
  saveEmployees(list) {
    lsSet('employees', list)
  },
  getMenuItems() {
    const overrides = lsGet('menu_overrides', {})
    return ALL_ITEMS.map((item) => ({ ...item, active: true, ...overrides[item.id] }))
  },
  saveMenuOverride(id, updates) {
    const overrides = lsGet('menu_overrides', {})
    overrides[id] = { ...(overrides[id] || {}), ...updates }
    lsSet('menu_overrides', overrides)
  },
  getTransactions(limit = 20) {
    const txns = lsGet('transactions', [])
    return txns.slice(-limit).reverse()
  },
  saveTransaction(txn, items) {
    const txns = lsGet('transactions', [])
    const id = `TXN-${Date.now()}`
    txns.push({ ...txn, id, items, created_at: new Date().toISOString() })
    lsSet('transactions', txns)
    return id
  },
  getCustomers() {
    return lsGet('customers', DEFAULT_CUSTOMERS)
  },
  upsertCustomer(customer) {
    const list = lsGet('customers', DEFAULT_CUSTOMERS)
    const idx = list.findIndex((c) => c.phone === customer.phone)
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...customer }
    } else {
      list.push({ id: Date.now(), ...customer })
    }
    lsSet('customers', list)
  },

  // ── Kitchen queue ──────────────────────────────────────────────────────────
  getKitchenOrders() {
    return lsGet('kitchen_orders', [])
  },
  saveKitchenOrder(order) {
    const orders = lsGet('kitchen_orders', [])
    orders.unshift(order)
    lsSet('kitchen_orders', orders.slice(0, 100))
  },
  updateKitchenOrder(id, status) {
    const orders = lsGet('kitchen_orders', [])
    const idx = orders.findIndex((o) => o.id === id)
    if (idx >= 0) orders[idx] = { ...orders[idx], status }
    lsSet('kitchen_orders', orders)
  },
}

// ─── DB facade ─────────────────────────────────────────────────────────────
export const DB = {
  async verifyPin(role, pin) {
    if (isConfigured) {
      try {
        const { data, error } = await supabase
          .from('employees')
          .select('*')
          .eq('role', role)
          .eq('pin', pin)
          .eq('active', true)
        if (!error && data && data.length > 0) return { ok: true, employee: data[0] }
        if (error) throw error
        return { ok: false }
      } catch (e) {
        console.warn('Supabase error, falling back to localDB', e)
      }
    }
    const employees = localDB.getEmployees()
    const emp = employees.find((e) => e.role === role && e.pin === pin && e.active)
    return emp ? { ok: true, employee: emp } : { ok: false }
  },

  async getEmployees() {
    if (isConfigured) {
      try {
        const { data, error } = await supabase.from('employees').select('*').order('id')
        if (!error) return data
      } catch (e) {
        console.warn('Supabase error', e)
      }
    }
    return localDB.getEmployees()
  },

  async createEmployee(emp) {
    if (isConfigured) {
      try {
        const { data, error } = await supabase.from('employees').insert([emp]).select()
        if (!error) return data[0]
      } catch (e) {
        console.warn('Supabase error', e)
      }
    }
    const list = localDB.getEmployees()
    const newEmp = { id: Date.now(), ...emp, active: true }
    list.push(newEmp)
    localDB.saveEmployees(list)
    return newEmp
  },

  async updateEmployee(id, updates) {
    if (isConfigured) {
      try {
        const { error } = await supabase.from('employees').update(updates).eq('id', id)
        if (!error) return true
      } catch (e) {
        console.warn('Supabase error', e)
      }
    }
    const list = localDB.getEmployees()
    const idx = list.findIndex((e) => e.id === id)
    if (idx >= 0) list[idx] = { ...list[idx], ...updates }
    localDB.saveEmployees(list)
    return true
  },

  async deleteEmployee(id) {
    if (isConfigured) {
      try {
        const { error } = await supabase.from('employees').delete().eq('id', id)
        if (!error) return true
      } catch (e) {
        console.warn('Supabase error', e)
      }
    }
    const list = localDB.getEmployees().filter((e) => e.id !== id)
    localDB.saveEmployees(list)
    return true
  },

  async getMenuItems() {
    if (isConfigured) {
      try {
        const { data, error } = await supabase.from('menu_items').select('*').order('id')
        if (!error && data && data.length > 0) {
          // Merge with local data
          return ALL_ITEMS.map((item) => {
            const remote = data.find((d) => d.name === item.name)
            return remote ? { ...item, ...remote } : item
          })
        }
      } catch (e) {
        console.warn('Supabase error', e)
      }
    }
    return localDB.getMenuItems()
  },

  async createMenuItem(item) {
    if (isConfigured) {
      try {
        const { data, error } = await supabase.from('menu_items').insert([item]).select()
        if (!error) return data[0]
      } catch (e) {
        console.warn('Supabase error', e)
      }
    }
    return { id: Date.now(), ...item }
  },

  async updateMenuItem(id, updates) {
    if (isConfigured) {
      try {
        const { error } = await supabase.from('menu_items').update(updates).eq('id', id)
        if (!error) return true
      } catch (e) {
        console.warn('Supabase error', e)
      }
    }
    localDB.saveMenuOverride(id, updates)
    return true
  },

  async saveTransaction(txn, items) {
    if (isConfigured) {
      try {
        const { data, error } = await supabase.from('transactions').insert([txn]).select()
        if (!error && data && data[0]) {
          const txnId = data[0].id
          const itemRows = items.map((it) => ({ ...it, transaction_id: txnId }))
          await supabase.from('transaction_items').insert(itemRows)
          return txnId
        }
      } catch (e) {
        console.warn('Supabase error', e)
      }
    }
    return localDB.saveTransaction(txn, items)
  },

  async getTransactions(limit = 20) {
    if (isConfigured) {
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit)
        if (!error) return data
      } catch (e) {
        console.warn('Supabase error', e)
      }
    }
    return localDB.getTransactions(limit)
  },

  async getCustomers() {
    if (isConfigured) {
      try {
        const { data, error } = await supabase.from('customers').select('*').order('points', { ascending: false })
        if (!error) return data
      } catch (e) {
        console.warn('Supabase error', e)
      }
    }
    return localDB.getCustomers()
  },

  async getKitchenOrders() {
    return localDB.getKitchenOrders()
  },
  async saveKitchenOrder(order) {
    localDB.saveKitchenOrder(order)
  },
  async updateKitchenOrder(id, status) {
    localDB.updateKitchenOrder(id, status)
  },

  async upsertCustomer(customer) {
    if (isConfigured) {
      try {
        const { error } = await supabase.from('customers').upsert([customer], { onConflict: 'phone' })
        if (!error) return true
      } catch (e) {
        console.warn('Supabase error', e)
      }
    }
    localDB.upsertCustomer(customer)
    return true
  },
}
