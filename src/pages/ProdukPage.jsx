import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function ProdukPage() {
  const [produkList, setProdukList] = useState([])
  const [loading, setLoading] = useState(true)
  const [produkDipilih, setProdukDipilih] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [jumlahPesanan, setJumlahPesanan] = useState(1)
  const [pesanNotif, setPesanNotif] = useState('')

  // Ambil data produk dari backend
  useEffect(() => {
    axios
      .get('https://galon.kesug.com/api/get_produk.php')
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : []
        setProdukList(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Gagal memuat produk:', err)
        setLoading(false)
      })
  }, [])

  const handlePesan = (produk) => {
    if (produk.stok <= 0) return
    setProdukDipilih(produk)
    setJumlahPesanan(1)
    setShowForm(true)
    setPesanNotif('')
  }

  // ✅ GANTI: Kirim ke backend, bukan ke WhatsApp
  const handlePesanLangsung = async () => {
   const namaInput = document.getElementById('namaPemesan')
   const alamatInput = document.getElementById('alamatPemesan')
   const jumlah = jumlahPesanan

   if (!namaInput || !alamatInput) {
     setPesanNotif('Form tidak ditemukan!')
     return
   }

   const nama = namaInput.value.trim()
   const alamat = alamatInput.value.trim()

   if (!nama || nama.length < 2) {
     setPesanNotif('Nama minimal 2 karakter!')
     return
   }
   if (!alamat || alamat.length < 5) {
     setPesanNotif('Alamat minimal 5 karakter!')
     return
   }
    


    if (jumlah > produkDipilih.stok) {
      setPesanNotif(`Stok hanya tersedia ${produkDipilih.stok} unit!`)
      return
    }

    const total_harga = jumlah * produkDipilih.harga

    const user = JSON.parse(localStorage.getItem('user'))
    const payload = {
      nama,
      produk_id: produkDipilih.produk_id,
      jumlah,
      alamat,
      total_harga
    }

    // ✅ Tambahkan user_id jika user sudah login
    if (user && user.role === 'pelanggan') {
      payload.user_id = user.user_id
    }

    try {
      const res = await axios.post(
        'https://galon.kesug.com/api/tambah_pemesanan.php',
        payload
      )

      if (res.data.status === 'success') {
        setPesanNotif('Pesanan berhasil dikirim!')

        setProdukList((prev) =>
          prev.map((p) =>
            p.produk_id === produkDipilih.produk_id
              ? { ...p, stok: p.stok - jumlah }
              : p
          )
        )

        setTimeout(() => {
          setShowForm(false)
        }, 1500)
      } else {
        setPesanNotif(res.data.message || 'Gagal mengirim pesanan')
      }
    } catch (err) {
      console.error('Error pesan:', err)
      setPesanNotif('Gagal terhubung ke server')
    }
  }

  const getGambarUrl = (gambar) => {
    if (!gambar) return '/logo192.png'
    if (gambar.startsWith('http')) return gambar
    return `https://galon.kesug.com/api/uploads/${gambar}`
  }

  if (loading) {
    return (
      <div className="font-sans bg-white min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Memuat produk...</p>
      </div>
    )
  }

  return (
    <div className="font-sans text-gray-800 bg-white min-h-screen flex flex-col">
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex-1">
        <h3 className="text-2xl font-bold mb-8 text-center text-gray-800">
          Produk Kami
        </h3>

        {produkList.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            Tidak ada produk tersedia saat ini.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {produkList.map((produk) => (
              <div
                key={produk.produk_id}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition p-5 flex flex-col"
              >
                <div className="flex justify-center mb-4">
                  <img
                    src={getGambarUrl(produk.gambar)}
                    alt={produk.nama}
                    onError={(e) => {
                      e.currentTarget.src = '/logo192.png'
                    }}
                    className="w-32 h-32 object-contain"
                  />
                </div>
                <h4 className="font-semibold text-blue-700 mb-2 text-center">
                  {produk.nama}
                </h4>
                <p className="text-gray-700 font-medium mb-1 text-center">
                  Rp {Number(produk.harga).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mb-3 text-center">
                  Stok:{' '}
                  <span
                    className={
                      produk.stok <= 0 ? 'text-red-500 font-medium' : ''
                    }
                  >
                    {produk.stok}
                  </span>
                </p>
                <button
                  disabled={produk.stok <= 0}
                  onClick={() => handlePesan(produk)}
                  className={`mt-auto py-2.5 rounded-lg font-medium transition ${
                    produk.stok <= 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {produk.stok <= 0 ? 'Stok Habis' : 'Pesan Sekarang'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Form Pemesanan */}
      {showForm && produkDipilih && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-3 text-blue-700 text-center">
              Form Pemesanan
            </h2>
            <p className="text-gray-700 mb-2 text-center">
              <b>{produkDipilih.nama}</b>
            </p>
            <p className="text-sm text-gray-500 mb-4 text-center">
              Stok tersedia: {produkDipilih.stok}
            </p>

            {pesanNotif && (
              <p
                className={`text-center mb-3 text-sm font-medium ${
                  pesanNotif.includes('berhasil')
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {pesanNotif}
              </p>
            )}

            <input
              id="namaPemesan"
              type="text"
              placeholder="Nama Anda"
              className="w-full mb-3 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              id="alamatPemesan"
              type="text"
              placeholder="Alamat Lengkap"
              className="w-full mb-3 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <label className="block text-left text-sm text-gray-600 mb-1">
              Jumlah Pesanan
            </label>
            <input
              type="number"
              min="1"
              max={produkDipilih.stok}
              value={jumlahPesanan}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1
                if (val >= 1 && val <= produkDipilih.stok) {
                  setJumlahPesanan(val)
                }
              }}
              className="w-full mb-5 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <button
              onClick={handlePesanLangsung}
              className="bg-blue-600 text-white w-full py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Kirim Pesanan
            </button>
          </div>
        </div>
      )}
    </div>
  )
}