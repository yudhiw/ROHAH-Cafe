import { useState, useEffect } from 'react'
import { MENU_DATA, ALL_ITEMS } from '../../../data/menu'
import { INIT_TABLES, fmt, stockInfo } from '../../../data/constants'
import { DB } from '../../../lib/db'

const CATEGORIES = Object.keys(MENU_DATA)
const TAX_RATE = 0.10

export default function CashierScreen({ user }) {
  const [cat, setCat] = useState(CATEGORIES[0])
  const [search, setSearch] = useState('')
  const [menuItems, setMenuItems] = useState(ALL_ITEMS)
  const [orderType, setOrderType] = useState('dine_in')
  const [tableId, setTableId] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [cart, setCart] = useState([])
  const [discountType, setDiscountType] = useState('pct') // 'pct' | 'rp'
  const [discountVal, setDiscountVal] = useState('')
  const [payModal, setPayModal] = useState(false)
  const [payMethod, setPayMethod] = useState('cash')
  const [cashInput, setCashInput] = useState('')
  const [splitModal, setSplitModal] = useState(false)
  const [splitCount, setSplitCount] = useState(2)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    DB.getMenuItems().then((data) => {
      if (data && data.length > 0) setMenuItems(data)
    })
  }, [])

  const filtered = menuItems.filter((item) => {
    if (item.active === false) return false
    const matchCat = item.cat === cat
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const addToCart = (item) => {
    setCart((prev) => {
      const ex = prev.find((c) => c.id === item.id)
      if (ex) return prev.map((c) => c.id === item.id ? { ...c, qty: c.qty + 1 } : c)
      return [...prev, { ...item, qty: 1 }]
    })
  }

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev.map((c) => c.id === id ? { ...c, qty: Math.max(0, c.qty + delta) } : c)
          .filter((c) => c.qty > 0)
    )
  }

  const removeItem = (id) => setCart((prev) => prev.filter((c) => c.id !== id))
  const clearCart = () => { setCart([]); setCustomerName(''); setDiscountVal('') }

  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0)
  const discountAmt = discountVal
    ? discountType === 'pct'
      ? Math.round(subtotal * (parseFloat(discountVal) / 100))
      : parseInt(discountVal.replace(/\D/g, '')) || 0
    : 0
  const taxBase = subtotal - discountAmt
  const tax = Math.round(taxBase * TAX_RATE)
  const total = taxBase + tax

  const cashAmt = parseInt(cashInput.replace(/\D/g, '')) || 0
  const change = cashAmt - total

  const quickAmounts = [50000, 100000, 150000, 200000]

  const handleConfirmPay = async () => {
    if (payMethod === 'cash' && cashAmt < total) return
    try {
      const txn = {
        cashier_name: user?.name,
        customer_name: customerName,
        order_type: orderType,
        table_id: tableId || null,
        subtotal,
        discount: discountAmt,
        tax,
        total,
        payment_method: payMethod,
        cash_received: payMethod === 'cash' ? cashAmt : null,
        change_given: payMethod === 'cash' ? change : null,
      }
      const items = cart.map((c) => ({ menu_item_id: c.id, name: c.name, price: c.price, qty: c.qty }))
      await DB.saveTransaction(txn, items)
    } catch (e) {
      console.error(e)
    }
    setPayModal(false)
    clearCart()
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  const cartQty = (id) => cart.find((c) => c.id === id)?.qty || 0

  return (
    <div className="flex h-full overflow-hidden">
      {/* LEFT PANEL */}
      <div className="flex-1 flex flex-col overflow-hidden p-4 gap-3">
        {/* Search + controls */}
        <div className="flex gap-2 items-center flex-wrap">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari menu..."
            className="flex-1 min-w-[120px] px-3 py-2 bg-pos-card border border-pos-border rounded-lg text-cream text-sm placeholder:text-cream/30 focus:outline-none focus:border-gold/50"
          />
          <div className="flex border border-pos-border rounded-lg overflow-hidden text-xs">
            {['dine_in', 'take_away'].map((t) => (
              <button
                key={t}
                onClick={() => setOrderType(t)}
                className={`px-3 py-2 transition-colors ${orderType === t ? 'bg-gold text-espresso font-medium' : 'text-cream/50 hover:bg-pos-card'}`}
              >
                {t === 'dine_in' ? '🪑 Dine In' : '🥡 Take Away'}
              </button>
            ))}
          </div>
          {orderType === 'dine_in' && (
            <select
              value={tableId}
              onChange={(e) => setTableId(e.target.value)}
              className="px-3 py-2 bg-pos-card border border-pos-border rounded-lg text-cream text-xs focus:outline-none"
            >
              <option value="">Pilih Meja</option>
              {INIT_TABLES.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          )}
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 flex-shrink-0">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all flex-shrink-0 ${
                cat === c ? 'bg-gold text-espresso border-gold' : 'border-pos-border text-cream/60 hover:border-gold/40'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Menu grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 content-start">
          {filtered.map((item) => {
            const qty = cartQty(item.id)
            const stock = item.stock ?? 99
            const habis = stock <= 0
            const si = stockInfo(stock)
            return (
              <button
                key={item.id}
                onClick={() => !habis && addToCart(item)}
                disabled={habis}
                className={`relative text-left p-3 rounded-xl border transition-all ${
                  habis
                    ? 'border-pos-border/30 bg-pos-card/40 opacity-50 cursor-not-allowed'
                    : qty > 0
                      ? 'border-gold/60 bg-gold/10'
                      : 'border-pos-border bg-pos-card hover:bg-pos-card-hover hover:border-pos-border/80'
                }`}
              >
                {/* Qty badge */}
                {qty > 0 && !habis && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gold text-espresso text-xs font-bold flex items-center justify-center">
                    {qty}
                  </div>
                )}
                <div className="text-2xl mb-2">{item.emoji}</div>
                <div className="text-cream/90 text-xs font-medium leading-snug mb-1.5 pr-5 line-clamp-2">{item.name}</div>
                <div className="flex items-center justify-between gap-1 flex-wrap">
                  <div className="text-gold text-xs font-semibold">{fmt(item.price)}</div>
                  {stock <= 5 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium leading-none ${si.cls}`}>
                      {si.label}
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-[300px] xl:w-[320px] bg-pos-sidebar border-l border-pos-border flex flex-col flex-shrink-0">
        {/* Header */}
        <div className="px-4 pt-4 pb-3 border-b border-pos-border flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-cream/90">Order Baru</h3>
            <p className="text-xs text-cream/40">{user?.name}</p>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setSplitModal(true)}
              className="px-2 py-1 text-xs bg-pos-card border border-pos-border rounded text-cream/50 hover:text-cream"
              title="Split Bill"
            >
              ✂️
            </button>
            <button
              onClick={clearCart}
              className="px-2 py-1 text-xs bg-pos-card border border-pos-border rounded text-cream/50 hover:text-pos-red"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Customer name */}
        <div className="px-4 py-2 border-b border-pos-border">
          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Nama pelanggan..."
            className="w-full px-3 py-1.5 bg-pos-card border border-pos-border rounded text-cream text-xs placeholder:text-cream/30 focus:outline-none focus:border-gold/50"
          />
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-cream/20">
              <span className="text-3xl mb-2">🛒</span>
              <span className="text-xs">Keranjang kosong</span>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center gap-2">
                <div className="text-lg">{item.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-cream/90 text-xs leading-tight line-clamp-1">{item.name}</div>
                  <div className="text-gold text-xs">{fmt(item.price * item.qty)}</div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateQty(item.id, -1)}
                    className="w-6 h-6 rounded bg-pos-card border border-pos-border text-cream/60 hover:text-cream text-xs flex items-center justify-center"
                  >−</button>
                  <span className="text-cream text-xs w-5 text-center">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, 1)}
                    className="w-6 h-6 rounded bg-pos-card border border-pos-border text-cream/60 hover:text-cream text-xs flex items-center justify-center"
                  >+</button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="w-6 h-6 rounded text-cream/30 hover:text-pos-red text-xs flex items-center justify-center ml-0.5"
                  >✕</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Discount */}
        <div className="px-4 py-3 border-t border-pos-border">
          <div className="flex gap-1 mb-2">
            <span className="text-cream/50 text-xs self-center">Diskon:</span>
            <div className="flex border border-pos-border rounded overflow-hidden text-xs">
              {['pct', 'rp'].map((t) => (
                <button
                  key={t}
                  onClick={() => { setDiscountType(t); setDiscountVal('') }}
                  className={`px-2 py-1 transition-colors ${discountType === t ? 'bg-gold/20 text-gold' : 'text-cream/40 hover:bg-pos-card'}`}
                >
                  {t === 'pct' ? '%' : 'Rp'}
                </button>
              ))}
            </div>
            <input
              value={discountVal}
              onChange={(e) => setDiscountVal(e.target.value)}
              placeholder={discountType === 'pct' ? '0' : '0'}
              className="flex-1 px-2 py-1 bg-pos-card border border-pos-border rounded text-cream text-xs placeholder:text-cream/30 focus:outline-none w-0"
            />
          </div>
        </div>

        {/* Summary */}
        <div className="px-4 pb-3 space-y-1 text-xs border-t border-pos-border pt-3">
          <div className="flex justify-between text-cream/60">
            <span>Subtotal</span><span>{fmt(subtotal)}</span>
          </div>
          <div className="flex justify-between text-cream/60">
            <span>PPN 10%</span><span>{fmt(tax)}</span>
          </div>
          {discountAmt > 0 && (
            <div className="flex justify-between text-pos-green">
              <span>Diskon</span><span>-{fmt(discountAmt)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-gold text-sm pt-1 border-t border-pos-border">
            <span>TOTAL</span><span>{fmt(total)}</span>
          </div>
        </div>

        {/* Pay button */}
        <div className="px-4 pb-4">
          <button
            onClick={() => { if (cart.length > 0) setPayModal(true) }}
            disabled={cart.length === 0}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
              cart.length > 0
                ? 'bg-gold text-espresso hover:bg-gold-light active:scale-95'
                : 'bg-pos-card text-cream/30 cursor-not-allowed'
            }`}
          >
            Bayar {cart.length > 0 ? fmt(total) : ''}
          </button>
        </div>
      </div>

      {/* PAYMENT MODAL */}
      {payModal && (
        <Modal onClose={() => setPayModal(false)}>
          <h2 className="font-playfair text-xl text-cream mb-1">Pembayaran</h2>
          <p className="text-cream/40 text-xs mb-4">Pilih metode pembayaran</p>

          {/* Method tabs */}
          <div className="grid grid-cols-4 gap-2 mb-5">
            {[
              { id: 'cash', label: 'Cash', icon: '💵' },
              { id: 'qris', label: 'QRIS', icon: '📱' },
              { id: 'debit', label: 'Debit', icon: '💳' },
              { id: 'transfer', label: 'Transfer', icon: '🏦' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setPayMethod(m.id)}
                className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs transition-all ${
                  payMethod === m.id ? 'border-gold bg-gold/10 text-gold' : 'border-pos-border text-cream/50 hover:border-gold/30'
                }`}
              >
                <span className="text-xl">{m.icon}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>

          {/* Total */}
          <div className="bg-pos-card rounded-xl p-4 mb-4 text-center">
            <div className="text-cream/50 text-xs mb-1">Total Pembayaran</div>
            <div className="font-playfair text-3xl text-gold">{fmt(total)}</div>
          </div>

          {payMethod === 'cash' ? (
            <div>
              {/* Quick amounts */}
              <div className="grid grid-cols-4 gap-2 mb-3">
                {quickAmounts.map((a) => (
                  <button
                    key={a}
                    onClick={() => setCashInput(String(a))}
                    className={`py-2 rounded-lg text-xs border transition-colors ${
                      cashInput === String(a) ? 'border-gold bg-gold/10 text-gold' : 'border-pos-border text-cream/60 hover:border-gold/30'
                    }`}
                  >
                    {fmt(a)}
                  </button>
                ))}
              </div>

              {/* Uang diterima display */}
              <div className="bg-pos-card rounded-lg px-4 py-3 mb-3 text-right">
                <div className="text-cream/40 text-xs">Uang Diterima</div>
                <div className="text-cream text-xl font-mono">
                  {cashInput ? fmt(parseInt(cashInput)) : '—'}
                </div>
              </div>

              {/* Numpad */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {['1','2','3','4','5','6','7','8','9','000','0','←'].map((k) => (
                  <button
                    key={k}
                    onClick={() => {
                      if (k === '←') setCashInput((p) => p.slice(0, -1))
                      else setCashInput((p) => (p === '0' ? k : p + k).replace(/^0+/, '') || '0')
                    }}
                    className="py-3 bg-pos-card border border-pos-border rounded-lg text-cream/80 hover:bg-pos-card-hover text-sm font-medium"
                  >
                    {k}
                  </button>
                ))}
              </div>

              {/* Kembalian */}
              <div className={`flex justify-between text-sm px-1 mb-4 ${change < 0 ? 'text-pos-red' : 'text-pos-green'}`}>
                <span>Kembalian</span>
                <span className="font-semibold">{change >= 0 ? fmt(change) : '—'}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 mb-4">
              <div className="text-5xl mb-3">
                {payMethod === 'qris' ? '📱' : payMethod === 'debit' ? '💳' : '🏦'}
              </div>
              <p className="text-cream/60 text-sm">
                {payMethod === 'qris' && 'Scan QR Code pada layar kasir'}
                {payMethod === 'debit' && 'Tap atau gesek kartu pada mesin EDC'}
                {payMethod === 'transfer' && 'Transfer ke nomor rekening yang tertera'}
              </p>
            </div>
          )}

          <button
            onClick={handleConfirmPay}
            disabled={payMethod === 'cash' && cashAmt < total}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
              payMethod !== 'cash' || cashAmt >= total
                ? 'bg-gold text-espresso hover:bg-gold-light'
                : 'bg-pos-card text-cream/30 cursor-not-allowed'
            }`}
          >
            Konfirmasi Pembayaran
          </button>
        </Modal>
      )}

      {/* SPLIT BILL MODAL */}
      {splitModal && (
        <Modal onClose={() => setSplitModal(false)}>
          <h2 className="font-playfair text-xl text-cream mb-4">Split Bill</h2>
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={() => setSplitCount((n) => Math.max(2, n - 1))}
              className="w-10 h-10 rounded-full bg-pos-card border border-pos-border text-cream hover:bg-pos-card-hover"
            >
              −
            </button>
            <div className="text-4xl font-playfair text-gold w-12 text-center">{splitCount}</div>
            <button
              onClick={() => setSplitCount((n) => Math.min(10, n + 1))}
              className="w-10 h-10 rounded-full bg-pos-card border border-pos-border text-cream hover:bg-pos-card-hover"
            >
              +
            </button>
          </div>
          <div className="bg-pos-card rounded-xl p-4 text-center mb-4">
            <div className="text-cream/50 text-xs mb-1">Per Orang</div>
            <div className="text-gold text-2xl font-playfair">{fmt(Math.ceil(total / splitCount))}</div>
            <div className="text-cream/30 text-xs mt-1">dari {fmt(total)}</div>
          </div>
          <button
            onClick={() => setSplitModal(false)}
            className="w-full py-3 bg-gold text-espresso rounded-xl font-semibold text-sm"
          >
            Lanjut Pembayaran
          </button>
        </Modal>
      )}

      {/* SUCCESS OVERLAY */}
      {success && (
        <div className="fixed inset-0 bg-espresso/90 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="font-playfair text-2xl text-cream">Pembayaran Berhasil!</h2>
            <p className="text-cream/50 text-sm mt-2">Terima kasih telah berbelanja di ROHAH Cafe</p>
          </div>
        </div>
      )}
    </div>
  )
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-espresso/80 flex items-center justify-center z-40 p-4">
      <div className="bg-pos-sidebar border border-pos-border rounded-2xl p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-cream/40 hover:text-cream text-xl"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  )
}
