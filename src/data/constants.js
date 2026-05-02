export const ROLES = {
  kasir:   { label: 'Kasir',   color: '#4caf7d', icon: '🏧', screens: ['cashier', 'table', 'kitchen'] },
  admin:   { label: 'Admin',   color: '#5090e0', icon: '⚙️',  screens: ['menuMgmt'] },
  manager: { label: 'Manager', color: '#e07830', icon: '📊', screens: ['cashier', 'table', 'kitchen', 'report', 'loyalty', 'menuMgmt'] },
  owner:   { label: 'Owner',   color: '#C8963E', icon: '👑', screens: ['cashier', 'table', 'kitchen', 'report', 'loyalty', 'menuMgmt', 'settings'] },
}

export const NAV_ITEMS = [
  { id: 'cashier',  label: 'Kasir',   icon: '🏧' },
  { id: 'table',    label: 'Meja',    icon: '🪑' },
  { id: 'kitchen',  label: 'Dapur',   icon: '👨‍🍳' },
  { id: 'report',   label: 'Laporan', icon: '📊' },
  { id: 'loyalty',  label: 'Loyalty', icon: '💛' },
  { id: 'menuMgmt', label: 'Menu',    icon: '📋' },
  { id: 'settings', label: 'Setting', icon: '⚙️' },
]

export const INIT_TABLES = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  label: `T${i + 1}`,
  status: ['available', 'occupied', 'reserved', 'occupied', 'available', 'occupied', 'available', 'available', 'reserved', 'occupied', 'available', 'occupied'][i],
  pax: [0, 2, 0, 4, 0, 3, 0, 0, 0, 2, 0, 5][i],
}))

export const fmt = (n) => 'Rp ' + n.toLocaleString('id-ID')
