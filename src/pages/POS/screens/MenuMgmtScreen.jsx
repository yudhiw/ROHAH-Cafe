import { useState, useEffect } from 'react'
import { MENU_DATA } from '../../../data/menu'
import { fmt } from '../../../data/constants'
import { DB } from '../../../lib/db'

const CATEGORIES = Object.keys(MENU_DATA)

export default function MenuMgmtScreen() {
  const [items, setItems] = useState([])
  const [cat, setCat] = useState('All')
  const [loading, setLoading] = useState(true)
  const [editItem, setEditItem] = useState(null)
  const [addOpen, setAddOpen] = useState(false)
  const [deactivateItem, setDeactivateItem] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    DB.getMenuItems().then((data) => {
      setItems(data || [])
      setLoading(false)
    })
  }, [])

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSaveEdit = async (updated) => {
    try {
      await DB.updateMenuItem(updated.id, updated)
      setItems((prev) => prev.map((i) => (i.id === updated.id ? { ...i, ...updated } : i)))
      setEditItem(null)
      showToast('Menu berhasil diperbarui')
    } catch {
      showToast('Gagal memperbarui menu', 'error')
    }
  }

  const handleAdd = async (newItem) => {
    try {
      const created = await DB.createMenuItem(newItem)
      setItems((prev) => [...prev, created])
      setAddOpen(false)
      showToast('Menu berhasil ditambahkan')
    } catch {
      showToast('Gagal menambah menu', 'error')
    }
  }

  const handleDeactivate = async () => {
    if (!deactivateItem) return
    try {
      await DB.updateMenuItem(deactivateItem.id, { active: false })
      setItems((prev) => prev.map((i) => (i.id === deactivateItem.id ? { ...i, active: false } : i)))
      setDeactivateItem(null)
      showToast('Menu dinonaktifkan')
    } catch {
      showToast('Gagal menonaktifkan menu', 'error')
    }
  }

  const filtered = items.filter((i) => cat === 'All' || i.cat === cat)

  return (
    <div className="h-full overflow-y-auto p-6 relative">
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

      {/* Controls */}
      <div className="flex gap-3 mb-5 flex-wrap items-center">
        <div className="flex gap-2 overflow-x-auto flex-1">
          {['All', ...CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap flex-shrink-0 transition-all ${
                cat === c ? 'bg-gold text-espresso border-gold' : 'border-pos-border text-cream/60 hover:border-gold/30'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="px-4 py-2 bg-gold text-espresso rounded-lg text-xs font-medium hover:bg-gold-light flex-shrink-0"
        >
          + Tambah Menu
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-16 text-cream/30 text-sm">Memuat data...</div>
      ) : (
        <div className="bg-pos-card border border-pos-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-12 px-5 py-3 border-b border-pos-border text-cream/40 text-xs font-medium">
            <span className="col-span-1">Icon</span>
            <span className="col-span-4">Nama</span>
            <span className="col-span-2">Kategori</span>
            <span className="col-span-2 text-right">Harga</span>
            <span className="col-span-1 text-center">Status</span>
            <span className="col-span-2 text-right">Aksi</span>
          </div>
          <div className="divide-y divide-pos-border/50">
            {filtered.map((item) => (
              <div key={item.id} className="grid grid-cols-12 px-5 py-3 hover:bg-pos-card-hover items-center">
                <span className="col-span-1 text-xl">{item.emoji}</span>
                <span className="col-span-4 text-cream/90 text-sm">{item.name}</span>
                <span className="col-span-2 text-cream/50 text-xs">{item.cat}</span>
                <span className="col-span-2 text-right text-gold text-sm font-medium">{fmt(item.price)}</span>
                <span className="col-span-1 flex justify-center">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      item.active !== false
                        ? 'bg-pos-green/20 text-pos-green'
                        : 'bg-pos-red/20 text-pos-red'
                    }`}
                  >
                    {item.active !== false ? 'Aktif' : 'Nonaktif'}
                  </span>
                </span>
                <div className="col-span-2 flex gap-1 justify-end">
                  <button
                    onClick={() => setEditItem({ ...item })}
                    className="px-2 py-1 text-xs bg-pos-bg border border-pos-border rounded text-cream/60 hover:text-gold hover:border-gold/30"
                  >
                    Edit
                  </button>
                  {item.active !== false && (
                    <button
                      onClick={() => setDeactivateItem(item)}
                      className="px-2 py-1 text-xs bg-pos-bg border border-pos-border rounded text-cream/60 hover:text-pos-red hover:border-pos-red/30"
                    >
                      Off
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editItem && (
        <ItemModal
          title="Edit Menu"
          item={editItem}
          onSave={handleSaveEdit}
          onClose={() => setEditItem(null)}
        />
      )}

      {/* Add Modal */}
      {addOpen && (
        <ItemModal
          title="Tambah Menu"
          item={{ name: '', price: '', emoji: '☕', cat: 'Coffee', active: true }}
          onSave={handleAdd}
          onClose={() => setAddOpen(false)}
        />
      )}

      {/* Deactivate confirm */}
      {deactivateItem && (
        <div className="fixed inset-0 bg-espresso/80 flex items-center justify-center z-40 p-4">
          <div className="bg-pos-sidebar border border-pos-red/30 rounded-2xl p-6 w-full max-w-sm">
            <div className="text-pos-red text-2xl mb-3">⚠️</div>
            <h3 className="text-cream font-playfair text-lg mb-2">Nonaktifkan Menu</h3>
            <div className="bg-pos-card rounded-lg p-3 mb-4 flex items-center gap-3">
              <span className="text-2xl">{deactivateItem.emoji}</span>
              <div>
                <div className="text-cream/90 text-sm">{deactivateItem.name}</div>
                <div className="text-gold text-xs">{fmt(deactivateItem.price)}</div>
              </div>
            </div>
            <p className="text-cream/60 text-xs mb-5">Menu ini tidak akan tampil di kasir. Anda bisa mengaktifkannya kembali kapan saja.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeactivateItem(null)}
                className="flex-1 py-2.5 border border-pos-border rounded-xl text-cream/60 text-sm hover:bg-pos-card"
              >
                Batal
              </button>
              <button
                onClick={handleDeactivate}
                className="flex-1 py-2.5 bg-pos-red rounded-xl text-cream text-sm font-medium hover:opacity-90"
              >
                Nonaktifkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ItemModal({ title, item, onSave, onClose }) {
  const [form, setForm] = useState({ ...item, price: String(item.price || '') })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ ...form, price: parseInt(form.price) || 0 })
  }

  return (
    <div className="fixed inset-0 bg-espresso/80 flex items-center justify-center z-40 p-4">
      <div className="bg-pos-sidebar border border-pos-border rounded-2xl p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-playfair text-cream text-lg">{title}</h3>
          <button onClick={onClose} className="text-cream/40 hover:text-cream text-xl">×</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Nama Menu" required>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full px-3 py-2 bg-pos-card border border-pos-border rounded-lg text-cream text-sm focus:outline-none focus:border-gold/50"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Harga (Rp)" required>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
                className="w-full px-3 py-2 bg-pos-card border border-pos-border rounded-lg text-cream text-sm focus:outline-none focus:border-gold/50"
              />
            </Field>
            <Field label="Emoji">
              <input
                value={form.emoji}
                onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                className="w-full px-3 py-2 bg-pos-card border border-pos-border rounded-lg text-cream text-sm text-center text-xl focus:outline-none focus:border-gold/50"
              />
            </Field>
          </div>
          <Field label="Kategori">
            <select
              value={form.cat}
              onChange={(e) => setForm({ ...form, cat: e.target.value })}
              className="w-full px-3 py-2 bg-pos-card border border-pos-border rounded-lg text-cream text-sm focus:outline-none"
            >
              {Object.keys(MENU_DATA).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-pos-border rounded-xl text-cream/60 text-sm hover:bg-pos-card">
              Batal
            </button>
            <button type="submit" className="flex-1 py-2.5 bg-gold text-espresso rounded-xl text-sm font-medium hover:bg-gold-light">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-cream/50 text-xs mb-1.5">{label}{required && ' *'}</label>
      {children}
    </div>
  )
}
