import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

// Import Navbar & Footer
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Import halaman
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProdukPage from './pages/ProdukPage'
import DashboardAdmin from './pages/DashboardAdmin'
import PesananSaya from './pages/PesananSaya'

export default function App() {
  return (
    <Router>
      <LayoutWithHide />
    </Router>
  )
}

function LayoutWithHide() {
  const location = useLocation()

  // List halaman yang tidak boleh menampilkan Navbar dan Footer
  const hideLayout = ["/login", "/register", "/dashboard","/pesanan-saya" ].includes(location.pathname)

  return (
    <>
      {!hideLayout && <Navbar />}

      <AnimatedRoutes />

      {!hideLayout && <Footer />}
    </>
  )
}

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/produk" element={<ProdukPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardAdmin />} />
        <Route path="/pesanan-saya" element={<PesananSaya />} />
      </Routes>
    </AnimatePresence>
  )
}
