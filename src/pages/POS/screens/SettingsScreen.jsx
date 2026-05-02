import { useState, useEffect } from 'react'
import { ROLES } from '../../../data/constants'
import { isConfigured } from '../../../lib/supabase'
import { DB } from '../../../lib/db'

const TABS = [
  { id: 'accounts', label: 'Manajemen Akun', icon: '👥' },
  { id: 'database', label: 'Database',       icon: '🗄️' },
  { id: 'cafe',     label: 'Info Cafe',      icon: '🏪' },
]

const ROLE_ORDER = ['owner', 'manager', 'admin', 'kasir']

export default function SettingsScreen() {
  const [tab, setTab] = useState('accounts')
  const [employees, setEmployees] = useState([])
  const [addOpen, setAddOpen] = useState(false)
  const [editEmp, setEditEmp] = useState(null)
  const [toast, setToast] = useState(null)

  const [cafeForm, setCafeForm] = useState({
    name: 'ROHAH Cafe',
    tagline: 'Rasa yang Hangat, Kenangan Abadi',
    address: 'Ruko Jl. Festive Garden, Jl. Grand Wisata No.83, Lambangsari, Kec. Tambun Sel., Kabupaten Bekasi, Jawa Barat 17510',
    instagram: '@rohah.cafe',
    tax: '10',
    currency: 'IDR',
  })

  useEffect(() => {
    DB.getEmployees().then((data) => setEmployees(data || []))
  }, [])

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleAddEmployee = async (emp) => {
    try {
      const created = await DB.createEmployee(emp)
      setEmployees((prev) => [...prev, created])
      setAddOpen(false)
      showToast('Akun berhasil ditambahkan')
    } catch {
      showToast('Gagal menambah akun', 'error')
    }
  }

  const handleEditPin = async (id, newPin) => {
    try {
      await DB.updateEmployee(id, { pin: newPin })
      setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, pin: newPin } : e)))
      setEditEmp(null)
      showToast('PIN berhasil diperbarui')
    } catch {
      showToast('Gagal memperbarui PIN', 'error')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Hapus akun ini?')) return
    try {
      await DB.deleteEmployee(id)
      setEmployees((prev) => prev.filter((e) => e.id !== id))
      showToast('Akun berhasil dihapus')
    } catch {
      showToast('Gagal menghapus akun', 'error')
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-lg ${
            toast.type === 'error' ? 'bg-pos-red text-cream' : 'bg-pos-green text-espresso'
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Tab bar */}
      <div className="flex gap-1 px-6 pt-5 pb-0 border-b border-pos-border">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium rounded-t-lg border-b-2 transition-all ${
              tab === t.id
                ? 'border-gold text-gold bg-gold/5'
                : 'border-transparent text-cream/50 hover:text-cream/80'
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* ACCOUNTS TAB */}
        {tab === 'accounts' && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="text-cream/70 text-sm">Total:</span>
                <span className="bg-gold/20 text-gold text-xs font-bold px-2 py-0.5 rounded-full">
                  {employees.length} akun
                </span>
              </div>
              <button
                onClick={() => setAddOpen(true)}
                className="px-4 py-2 bg-gold text-espresso rounded-lg text-xs font-medium hover:bg-gold-light"
              >
                + Tambah Akun
              </button>
            </div>

            <div className="bg-pos-card border border-pos-border rounded-xl overflow-hidden">
              <div className="grid grid-cols-12 px-5 py-3 border-b border-pos-border text-cream/40 text-xs font-medium">
                <span className="col-span-4">Nama</span>
                <span className="col-span-3">Role</span>
                <span className="col-span-3">PIN</span>
                <span className="col-span-2 text-right">Aksi</span>
              </div>
              <div className="divide-y divide-pos-border/50">
                {employees.map((emp) => {
                  const roleConfig = ROLES[emp.role] || {}
                  return (
                    <div key={emp.id} className="grid grid-cols-12 px-5 py-3 hover:bg-pos-card-hover items-center">
                      <div className="col-span-4 text-cream/90 text-sm">{emp.name}</div>
                      <div className="col-span-3">
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{ color: roleConfig.color, backgroundColor: (roleConfig.color || '#888') + '22' }}
                        >
                          {roleConfig.icon} {roleConfig.label}
                        </span>
                      </div>
                      <div className="col-span-3 flex gap-1 items-center">
                        {Array.from({ length: emp.pin?.length || 4 }).map((_, i) => (
                          <div key={i} className="w-2 h-2 rounded-full bg-cream/30" />
                        ))}
                      </div>
                      <div className="col-span-2 flex gap-1 justify-end">
                        <button
                          onClick={() => setEditEmp({ ...emp, newPin: '' })}
                          className="px-2 py-1 text-xs bg-pos-bg border border-pos-border rounded text-cream/60 hover:text-gold"
                        >
                          PIN
                        </button>
                        <button
                          onClick={() => handleDelete(emp.id)}
                          className="px-2 py-1 text-xs bg-pos-bg border border-pos-border rounded text-cream/60 hover:text-pos-red"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* DATABASE TAB */}
        {tab === 'database' && (
          <div className="max-w-lg space-y-5">
            <div className={`flex items-center gap-3 p-4 rounded-xl border ${isConfigured ? 'border-pos-green/30 bg-pos-green/5' : 'border-pos-orange/30 bg-pos-orange/5'}`}>
              <div className={`w-3 h-3 rounded-full ${isConfigured ? 'bg-pos-green' : 'bg-pos-orange'} animate-pulse`} />
              <div>
                <div className="font-medium text-sm" style={{ color: isConfigured ? '#4caf7d' : '#e07830' }}>
                  {isConfigured ? 'Terhubung ke Supabase' : 'Mode Demo (Data Lokal)'}
                </div>
                <div className="text-cream/40 text-xs mt-0.5">
                  {isConfigured ? 'Data disimpan ke cloud' : 'Data disimpan di browser (localStorage)'}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-cream/50 text-xs mb-1.5">Supabase URL</label>
              <input
                readOnly
                value={import.meta.env.VITE_SUPABASE_URL || '— Belum dikonfigurasi —'}
                className="w-full px-3 py-2 bg-pos-card border border-pos-border rounded-lg text-cream/50 text-sm font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-cream/50 text-xs mb-1.5">Supabase Anon Key</label>
              <input
                readOnly
                value={import.meta.env.VITE_SUPABASE_ANON_KEY ? '••••••••••••••••••••••••' : '— Belum dikonfigurasi —'}
                className="w-full px-3 py-2 bg-pos-card border border-pos-border rounded-lg text-cream/50 text-sm font-mono focus:outline-none"
              />
            </div>

            <div className="bg-pos-card border border-pos-border rounded-xl p-4 text-xs text-cream/50 space-y-1">
              <p className="font-medium text-cream/70 mb-2">Setup Supabase:</p>
              <p>1. Buat project baru di <a href="https://supabase.com" target="_blank" className="text-gold underline">supabase.com</a></p>
              <p>2. Jalankan file <code className="bg-pos-bg px-1 rounded">supabase/schema.sql</code> di SQL Editor</p>
              <p>3. Jalankan <code className="bg-pos-bg px-1 rounded">supabase/seed.sql</code> untuk data awal</p>
              <p>4. Jalankan <code className="bg-pos-bg px-1 rounded">supabase/rls-policies.sql</code> untuk RLS</p>
              <p>5. Isi <code className="bg-pos-bg px-1 rounded">.env</code> dengan URL dan Anon Key dari Project Settings</p>
            </div>
          </div>
        )}

        {/* CAFE INFO TAB */}
        {tab === 'cafe' && (
          <div className="max-w-lg space-y-4">
            {[
              { key: 'name',      label: 'Nama Cafe',    type: 'text' },
              { key: 'tagline',   label: 'Tagline',      type: 'text' },
              { key: 'address',   label: 'Alamat',       type: 'textarea' },
              { key: 'instagram', label: 'Instagram',    type: 'text' },
              { key: 'tax',       label: 'Pajak (%)',    type: 'number' },
              { key: 'currency',  label: 'Mata Uang',    type: 'text' },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-cream/50 text-xs mb-1.5">{f.label}</label>
                {f.type === 'textarea' ? (
                  <textarea
                    value={cafeForm[f.key]}
                    onChange={(e) => setCafeForm({ ...cafeForm, [f.key]: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-pos-card border border-pos-border rounded-lg text-cream text-sm focus:outline-none focus:border-gold/50 resize-none"
                  />
                ) : (
                  <input
                    type={f.type}
                    value={cafeForm[f.key]}
                    onChange={(e) => setCafeForm({ ...cafeForm, [f.key]: e.target.value })}
                    className="w-full px-3 py-2 bg-pos-card border border-pos-border rounded-lg text-cream text-sm focus:outline-none focus:border-gold/50"
                  />
                )}
              </div>
            ))}
            <button
              onClick={() => showToast('Pengaturan disimpan (demo)')}
              className="w-full py-3 bg-gold text-espresso rounded-xl font-medium text-sm hover:bg-gold-light mt-2"
            >
              Simpan Pengaturan
            </button>
          </div>
        )}
      </div>

      {/* Add Employee Modal */}
      {addOpen && (
        <EmpModal
          title="Tambah Akun"
          onSave={handleAddEmployee}
          onClose={() => setAddOpen(false)}
        />
      )}

      {/* Edit PIN Modal */}
      {editEmp && (
        <div className="fixed inset-0 bg-espresso/80 flex items-center justify-center z-40 p-4">
          <div className="bg-pos-sidebar border border-pos-border rounded-2xl p-6 w-full max-w-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-playfair text-cream">Edit PIN</h3>
              <button onClick={() => setEditEmp(null)} className="text-cream/40 hover:text-cream">×</button>
            </div>
            <p className="text-cream/60 text-xs mb-4">{editEmp.name} ({ROLES[editEmp.role]?.label})</p>
            <input
              type="password"
              value={editEmp.newPin}
              onChange={(e) => setEditEmp({ ...editEmp, newPin: e.target.value })}
              placeholder="PIN baru (4-6 digit)"
              maxLength={6}
              className="w-full px-3 py-2 bg-pos-card border border-pos-border rounded-lg text-cream text-sm mb-4 focus:outline-none focus:border-gold/50"
            />
            <div className="flex gap-3">
              <button onClick={() => setEditEmp(null)} className="flex-1 py-2.5 border border-pos-border rounded-xl text-cream/60 text-sm">
                Batal
              </button>
              <button
                onClick={() => editEmp.newPin && handleEditPin(editEmp.id, editEmp.newPin)}
                disabled={!editEmp.newPin}
                className="flex-1 py-2.5 bg-gold text-espresso rounded-xl text-sm font-medium disabled:opacity-50"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function EmpModal({ title, onSave, onClose }) {
  const [form, setForm] = useState({ name: '', pin: '', role: 'kasir', active: true })

  return (
    <div className="fixed inset-0 bg-espresso/80 flex items-center justify-center z-40 p-4">
      <div className="bg-pos-sidebar border border-pos-border rounded-2xl p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-playfair text-cream">{title}</h3>
          <button onClick={onClose} className="text-cream/40 hover:text-cream">×</button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-cream/50 text-xs mb-1.5">Nama</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 bg-pos-card border border-pos-border rounded-lg text-cream text-sm focus:outline-none focus:border-gold/50"
            />
          </div>
          <div>
            <label className="block text-cream/50 text-xs mb-1.5">PIN (4-6 digit)</label>
            <input
              type="password"
              value={form.pin}
              onChange={(e) => setForm({ ...form, pin: e.target.value })}
              maxLength={6}
              className="w-full px-3 py-2 bg-pos-card border border-pos-border rounded-lg text-cream text-sm focus:outline-none focus:border-gold/50"
            />
          </div>
          <div>
            <label className="block text-cream/50 text-xs mb-2">Role</label>
            <div className="grid grid-cols-2 gap-2">
              {ROLE_ORDER.map((role) => {
                const cfg = ROLES[role]
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setForm({ ...form, role })}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs transition-all"
                    style={{
                      borderColor: form.role === role ? cfg.color : '#3a2e1a',
                      backgroundColor: form.role === role ? cfg.color + '22' : '#221b10',
                      color: form.role === role ? cfg.color : '#a09080',
                    }}
                  >
                    <span>{cfg.icon}</span>
                    <span>{cfg.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-2.5 border border-pos-border rounded-xl text-cream/60 text-sm">
              Batal
            </button>
            <button
              onClick={() => form.name && form.pin && onSave(form)}
              disabled={!form.name || !form.pin}
              className="flex-1 py-2.5 bg-gold text-espresso rounded-xl text-sm font-medium disabled:opacity-50"
            >
              Tambahkan
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
