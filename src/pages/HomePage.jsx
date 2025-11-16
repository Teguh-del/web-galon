import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function HomePage() {

     ;<motion.div
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       exit={{ opacity: 0 }}
       transition={{ duration: 0.4 }}
     >
       {/* isi konten homepage */}
     </motion.div>
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  if (!loaded) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-blue-600 text-white">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="animate-pulse">Memuat Halaman...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="font-sans text-gray-800 bg-white min-h-screen">
      <section className="bg-blue-50 py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0 w-full md:w-1/2 flex justify-center">
            <img
              src="/galong.png" 
              alt="Air Minum Isi Ulang GalonKu"
              className="rounded-xl shadow-lg max-w-full h-auto object-cover"
              style={{ maxHeight: '400px' }}
            />
          </div>

          <div className="w-full md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl font-bold text-blue-700 mb-4">
              Solusi Air Minum Bersih dan Higienis
            </h2>
            <p className="text-gray-600 mb-6">
              Kami menyediakan layanan isi ulang air minum bersih dan higienis
              serta penjualan galon kosong berkualitas tinggi, yang diproses
              melalui sistem filtrasi modern dan standar kebersihan ketat,
              sehingga menjamin kesehatan dan kenyamanan Anda serta keluarga
              dalam setiap teguk air yang dikonsumsi sehari-hari.
            </p>
            <a
              href="/produk"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition inline-block"
            >
              Lihat Produk
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
