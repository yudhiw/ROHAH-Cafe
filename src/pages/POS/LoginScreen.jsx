import { useState, useEffect } from 'react'
import { ROLES } from '../../data/constants'
import { isConfigured } from '../../lib/supabase'
import { DB } from '../../lib/db'

const LOCKOUT_KEY = 'rohah_lockout'
const ATTEMPTS_KEY = 'rohah_attempts'
const MAX_ATTEMPTS = 5
const LOCKOUT_MS = 5 * 60 * 1000

const ROLE_ORDER = ['kasir', 'admin', 'manager', 'owner']

const HINTS = [
  { role: 'kasir',   pin: '1111' },
  { role: 'admin',   pin: '2222' },
  { role: 'manager', pin: '3333' },
  { role: 'owner',   pin: '0000' },
]

export default function LoginScreen({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState(null)
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)
  const [loading, setLoading] = useState(false)
  const [lockoutUntil, setLockoutUntil] = useState(null)
  const [remaining, setRemaining] = useState(0)

  // Check lockout on mount
  useEffect(() => {
    const lu = sessionStorage.getItem(LOCKOUT_KEY)
    if (lu) {
      const t = parseInt(lu)
      if (Date.now() < t) {
        setLockoutUntil(t)
      } else {
        sessionStorage.removeItem(LOCKOUT_KEY)
        sessionStorage.removeItem(ATTEMPTS_KEY)
      }
    }
  }, [])

  // Countdown timer
  useEffect(() => {
    if (!lockoutUntil) return
    const interval = setInterval(() => {
      const rem = Math.ceil((lockoutUntil - Date.now()) / 1000)
      if (rem <= 0) {
        setLockoutUntil(null)
        setRemaining(0)
        sessionStorage.removeItem(LOCKOUT_KEY)
        sessionStorage.removeItem(ATTEMPTS_KEY)
        clearInterval(interval)
      } else {
        setRemaining(rem)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [lockoutUntil])

  const handleDigit = (d) => {
    if (lockoutUntil) return
    if (pin.length < 6) {
      setPin((p) => p + d)
      setError('')
    }
  }

  const handleBack = () => {
    setPin((p) => p.slice(0, -1))
    setError('')
  }

  const handleConfirm = async () => {
    if (!selectedRole) {
      setError('Pilih role terlebih dahulu')
      triggerShake()
      return
    }
    if (pin.length === 0) {
      setError('Masukkan PIN')
      triggerShake()
      return
    }
    if (lockoutUntil) return

    setLoading(true)
    try {
      const result = await DB.verifyPin(selectedRole, pin)
      if (result.ok) {
        sessionStorage.removeItem(ATTEMPTS_KEY)
        onLogin(result.employee)
      } else {
        const attempts = parseInt(sessionStorage.getItem(ATTEMPTS_KEY) || '0') + 1
        sessionStorage.setItem(ATTEMPTS_KEY, String(attempts))
        if (attempts >= MAX_ATTEMPTS) {
          const until = Date.now() + LOCKOUT_MS
          sessionStorage.setItem(LOCKOUT_KEY, String(until))
          setLockoutUntil(until)
          setError('Terlalu banyak percobaan. Tunggu 5 menit.')
        } else {
          setError(`PIN salah. ${MAX_ATTEMPTS - attempts} percobaan tersisa.`)
        }
        triggerShake()
        setPin('')
      }
    } catch (e) {
      setError('Error: ' + e.message)
      triggerShake()
    } finally {
      setLoading(false)
    }
  }

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  return (
    <div className="min-h-screen bg-pos-bg flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-8 text-center">
        <img
          src="/uploads/logo-1777600521020.png"
          alt="ROHAH"
          style={{ height: 56, filter: 'brightness(0) sepia(1) hue-rotate(10deg) saturate(2) brightness(0.8)', margin: '0 auto' }}
        />
        <p className="text-cream/40 text-xs tracking-widest mt-2 font-light">Point of Sale System</p>
      </div>

      {/* Status indicator */}
      <div className="flex items-center gap-2 mb-8">
        <div className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-pos-green' : 'bg-pos-orange'} animate-pulse`} />
        <span className="text-xs text-cream/40">
          {isConfigured ? 'Terhubung ke Supabase' : 'Mode Demo (Data Lokal)'}
        </span>
      </div>

      {/* Role selection */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 w-full max-w-sm">
        {ROLE_ORDER.map((role) => {
          const r = ROLES[role]
          const active = selectedRole === role
          return (
            <button
              key={role}
              onClick={() => { setSelectedRole(role); setPin(''); setError('') }}
              className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border transition-all"
              style={{
                borderColor: active ? r.color : '#3a2e1a',
                backgroundColor: active ? r.color + '22' : '#221b10',
                color: active ? r.color : '#a09080',
              }}
            >
              <span className="text-xl">{r.icon}</span>
              <span className="text-xs font-medium">{r.label}</span>
            </button>
          )
        })}
      </div>

      {/* PIN dots */}
      <div className={`flex gap-3 mb-6 ${shake ? 'animate-[shake_0.5s_ease]' : ''}`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full border-2 transition-all ${
              i < pin.length
                ? 'bg-gold border-gold'
                : 'bg-transparent border-pos-border'
            }`}
          />
        ))}
      </div>

      {/* Error */}
      {error && (
        <p className="text-pos-red text-xs mb-4 text-center max-w-xs">{error}</p>
      )}
      {lockoutUntil && (
        <p className="text-pos-orange text-xs mb-4">Terkunci: {remaining}s</p>
      )}

      {/* Numpad */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <NumKey key={n} label={String(n)} onClick={() => handleDigit(String(n))} disabled={!!lockoutUntil} />
        ))}
        <NumKey label="←" onClick={handleBack} disabled={!!lockoutUntil} variant="secondary" />
        <NumKey label="0" onClick={() => handleDigit('0')} disabled={!!lockoutUntil} />
        <NumKey
          label={loading ? '...' : '✓'}
          onClick={handleConfirm}
          disabled={!!lockoutUntil || loading}
          variant="confirm"
        />
      </div>

      {/* Demo PIN hints */}
      <div className="mt-8 w-full max-w-xs">
        <p className="text-cream/20 text-xs text-center mb-2">Demo PIN:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {HINTS.map((h) => (
            <button
              key={h.role}
              onClick={() => { setSelectedRole(h.role); setPin(h.pin); setError('') }}
              className="text-xs text-cream/30 hover:text-gold transition-colors px-2 py-1 rounded border border-pos-border hover:border-gold/30"
            >
              {ROLES[h.role].label}: {h.pin}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function NumKey({ label, onClick, disabled, variant = 'default' }) {
  const base = 'h-14 rounded-xl font-medium text-lg transition-all active:scale-95 select-none'
  const variants = {
    default: 'bg-pos-card text-cream hover:bg-pos-card-hover border border-pos-border',
    secondary: 'bg-pos-card text-cream/60 hover:bg-pos-card-hover border border-pos-border',
    confirm: 'bg-gold text-espresso hover:bg-gold-light border border-gold',
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
      {label}
    </button>
  )
}
