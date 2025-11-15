// Versi dengan Tailwind class yang sudah dimodifikasi lebih estetik
// Hanya styling yang diubah, struktur & logika tetap sama

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion'

const API_BASE = 'http://localhost/backend'

export default function PesananSaya() {
  const navigate = useNavigate()
  const [pesanan, setPesanan] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user || user.role !== 'pelanggan') {
      navigate('/login')
      return
    }

    const fetchPesanan = async () => {
      try {
        const res = await axios.get(`${API_BASE}/get_pesanan_saya.php`, {
          withCredentials: true
        })
        setPesanan(Array.isArray(res.data) ? res.data : [])
        setLoading(false)
      } catch (err) {
        console.error('Gagal ambil pesanan:', err)
        setError('Gagal memuat data pesanan. Silakan login ulang.')
        setLoading(false)
      }
    }

    fetchPesanan()
  }, [navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full shadow-xl"
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-8 border border-white/40">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-red-500 text-6xl mb-4"
          >
            ⚠️
          </motion.div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Ups! Terjadi Kesalahan
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-blue-200"
          >
            Login Ulang
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-6 px-4 pb-24">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-900 mb-10 text-center drop-shadow-sm"
        >
          📦 Pesanan Saya
        </motion.h1>

        {pesanan.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-10 text-center max-w-md mx-auto border border-white/40"
          >
            <div className="text-6xl mb-4 text-indigo-400">📭</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Belum Ada Pesanan
            </h2>
            <p className="text-gray-600 mb-6">
              Silakan pesan produk terlebih dahulu.
            </p>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-200 hover:opacity-90 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Lihat Produk
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {pesanan.map((p, i) => {
              let statusColor = 'text-sky-700'
              let statusBg = 'bg-sky-100'

              if (p.status === 'Selesai') {
                statusColor = 'text-emerald-700'
                statusBg = 'bg-emerald-100'
              } else if (p.status === 'Diantar') {
                statusColor = 'text-amber-700'
                statusBg = 'bg-amber-100'
              }

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: i * 0.05,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden hover:scale-[1.01] transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-xl text-gray-900">
                          {p.produk}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(p.created_at).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>

                      <span
                        className={`px-4 py-1 rounded-full text-xs font-bold ${statusColor} ${statusBg}`}
                      >
                        {p.status}
                      </span>
                    </div>

                    <div className="h-px bg-gray-100 mb-4" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="bg-indigo-50 rounded-xl p-4">
                        <p className="text-indigo-700 font-medium">Jumlah</p>
                        <p className="text-gray-900 font-semibold">
                          {p.jumlah} unit
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-4 sm:col-span-2 border border-gray-100">
                        <p className="text-gray-600 font-medium">
                          Alamat Pengiriman
                        </p>
                        <p className="text-gray-900 mt-1">{p.alamat}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium text-lg transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  )
}