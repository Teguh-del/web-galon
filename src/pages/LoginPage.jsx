import React, { useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const API_BASE = 'https://galon.kesug.com/api/login.php' // ✅ pastikan ini ada

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pesan, setPesan] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const res = await axios.post(
        `${API_BASE}/login.php`,
        { email, password },
        { withCredentials: true }
      )

      if (res.data.status === 'success') {
        const user = res.data.user
        localStorage.setItem('user', JSON.stringify(user)) // ✅ simpan data user

        setPesan('Login berhasil!')

        // ✅ Redirect berdasarkan role
        setTimeout(() => {
          if (user.role === 'admin') {
            navigate('/dashboard')
          } else if (user.role === 'pelanggan') {
            navigate('/pesanan-saya')
          }
        }, 800)
      } else {
        setPesan('Email atau kata sandi salah!')
      }
    } catch (err) {
      console.error('Error saat login:', err)
      setPesan('Terjadi kesalahan pada server.')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-white p-8 rounded-2xl shadow-2xl w-96"
      >
        {/* ✅ Judul netral */}
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Login Akun
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <input
            type="password"
            placeholder="Kata Sandi"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Masuk
          </motion.button>
        </form>

        {pesan && (
          <p className="text-center text-gray-600 mt-4 text-sm">{pesan}</p>
        )}

        <p className="text-center text-sm mt-4 text-gray-600">
          Belum punya akun?{' '}
          <a
            href="/register"
            className="text-blue-600 hover:underline hover:text-blue-800"
          >
            Daftar di sini
          </a>
        </p>
      </motion.div>
    </div>
  )
}
