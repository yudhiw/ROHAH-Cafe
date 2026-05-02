import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import POS from './pages/POS'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pos" element={<POS />} />
    </Routes>
  )
}
