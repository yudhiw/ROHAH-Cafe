import { useState, useEffect } from 'react'
import { ROLES } from '../../data/constants'
import LoginScreen from './LoginScreen'
import Layout from './Layout'
import CashierScreen from './screens/CashierScreen'
import TableScreen from './screens/TableScreen'
import KitchenScreen from './screens/KitchenScreen'
import ReportScreen from './screens/ReportScreen'
import LoyaltyScreen from './screens/LoyaltyScreen'
import MenuMgmtScreen from './screens/MenuMgmtScreen'
import SettingsScreen from './screens/SettingsScreen'

const SESSION_KEY = 'rohah_session'

const SCREEN_MAP = {
  cashier:  CashierScreen,
  table:    TableScreen,
  kitchen:  KitchenScreen,
  report:   ReportScreen,
  loyalty:  LoyaltyScreen,
  menuMgmt: MenuMgmtScreen,
  settings: SettingsScreen,
}

export default function POS() {
  const [user, setUser] = useState(null)
  const [activeScreen, setActiveScreen] = useState('cashier')

  // Restore session on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setUser(parsed.user)
        setActiveScreen(parsed.screen || 'cashier')
      }
    } catch {}
  }, [])

  const handleLogin = (employee) => {
    setUser(employee)
    const defaultScreen = ROLES[employee.role]?.screens?.[0] || 'cashier'
    setActiveScreen(defaultScreen)
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ user: employee, screen: defaultScreen }))
  }

  const handleLogout = () => {
    setUser(null)
    sessionStorage.removeItem(SESSION_KEY)
  }

  const handleSetScreen = (screen) => {
    setActiveScreen(screen)
    if (user) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ user, screen }))
    }
  }

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />
  }

  const ScreenComponent = SCREEN_MAP[activeScreen] || CashierScreen

  return (
    <Layout
      user={user}
      activeScreen={activeScreen}
      setActiveScreen={handleSetScreen}
      onLogout={handleLogout}
    >
      <ScreenComponent user={user} />
    </Layout>
  )
}
