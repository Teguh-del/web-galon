import React, { useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'

export default function RegisterPage() {
  const [nama, setNama] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pesan, setPesan] = useState('')

 const handleRegister = async (e) => {
   e.preventDefault()
   if (!nama || !email || !password) {
     setPesan('Semua field wajib diisi!')
     return
   }
   try {
     const res = await axios.post('http://localhost/backend/register.php', {
       nama,
       email,
       password
     })
     setPesan(res.data.message)
   } catch (err) {
     console.error('Error:', err)
     setPesan('Gagal terhubung ke server')
   }
 }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-400">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="bg-white p-8 rounded-2xl shadow-2xl w-96"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
          Daftar Akun
        </h2>
        <form onSubmit={handleRegister} className="space-y-5">
          <input
            type="text"
            placeholder="Nama Lengkap"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="password"
            placeholder="Kata Sandi"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Daftar
          </motion.button>
        </form>
        {pesan && (
          <p className="text-center text-gray-600 mt-4 text-sm">{pesan}</p>
        )}
        <p className="text-center text-sm mt-4 text-gray-600">
          Sudah punya akun?{' '}
          <a
            href="/login"
            className="text-blue-600 hover:underline hover:text-blue-800"
          >
            Login di sini
          </a>
        </p>
      </motion.div>
    </div>
  )
}
