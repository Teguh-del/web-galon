import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'

const API_BASE = 'https://galon.kesug.com/api'

export default function DashboardAdmin() {
  const [updatingId, setUpdatingId] = useState(null)
  const [pemesanan, setPemesanan] = useState([])
  const [produk, setProduk] = useState([])
  const [showTambahProduk, setShowTambahProduk] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [newProduct, setNewProduct] = useState({
    nama: '',
    deskripsi: '',
    harga: '',
    stok: ''
  })
  const [gambarFile, setGambarFile] = useState(null)
  const [previewGambar, setPreviewGambar] = useState(null)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const currentUser = { name: 'Admin Toko', role: 'Administrator' }

  useEffect(() => {
    axios
      .get(`${API_BASE}/get_produk.php`)
      .then((res) => setProduk(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error('Gagal ambil data produk:', err))

    axios
      .get(`${API_BASE}/get_pemesanan.php`)
      .then((res) => setPemesanan(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error('Gagal ambil data pemesanan:', err))
  }, [])

  const handleTambahProduk = () => {
    const { nama, deskripsi, harga, stok } = newProduct
    if (!nama || !deskripsi || !harga || !stok) {
      alert('Semua field wajib diisi!')
      return
    }

    const formData = new FormData()
    formData.append('nama', nama)
    formData.append('deskripsi', deskripsi)
    formData.append('harga', harga)
    formData.append('stok', stok)
    if (gambarFile) {
      formData.append('gambar', gambarFile)
    }

    axios
      .post(`${API_BASE}/tambah_produk.php`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      .then((res) => {
        if (res.data?.status === 'success') {
          alert('Produk berhasil ditambahkan!')
          const gambarUrl = gambarFile
            ? `uploads/${res.data.gambar || gambarFile.name}`
            : null

          setProduk([
            ...produk,
            {
              produk_id: res.data.produk_id || Date.now(),
              nama,
              deskripsi,
              harga: Number(harga),
              stok: Number(stok),
              gambar: gambarUrl
            }
          ])
          setShowTambahProduk(false)
          setNewProduct({ nama: '', deskripsi: '', harga: '', stok: '' })
          setGambarFile(null)
          setPreviewGambar(null)
        } else {
          alert(res.data?.message || 'Gagal menambahkan produk.')
        }
      })
      .catch((err) => {
        console.error('Error tambah produk:', err)
        alert(
          'Gagal menambahkan produk. Pastikan backend berjalan dan CORS diaktifkan.'
        )
      })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setGambarFile(file)
      setPreviewGambar(URL.createObjectURL(file))
    }
  }

  const handleLogout = () => setShowLogoutConfirm(true)
  const confirmLogout = () => {
    localStorage.removeItem('authToken')
    window.location.href = '/'
  }
  const cancelLogout = () => setShowLogoutConfirm(false)

  const updateStatus = async (id_pemesanan, currentStatus) => {
    let newStatus = 'Pending'
    if (currentStatus === 'Pending') newStatus = 'Diantar'
    else if (currentStatus === 'Diantar') newStatus = 'Selesai'
    else return

    setUpdatingId(id_pemesanan)
    try {
      const res = await axios.post(`${API_BASE}/update_status.php`, {
        id_pemesanan,
        status: newStatus
      })
      if (res.data.status === 'success') {
        setPemesanan((prev) =>
          prev.map((p) =>
            p.id_pemesanan === id_pemesanan ? { ...p, status: newStatus } : p
          )
        )
      } else {
        alert('Gagal memperbarui status')
      }
    } catch (err) {
      console.error('Error update status:', err)
      alert('Gagal terhubung ke server')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleHapusProduk = async (produk_id, namaProduk) => {
    if (!window.confirm(`Yakin ingin menghapus produk "${namaProduk}"?`)) return
    try {
      const res = await axios.post(`${API_BASE}/hapus_produk.php`, {
        produk_id
      })
      if (res.data?.status === 'success') {
        setProduk((prev) => prev.filter((p) => p.produk_id !== produk_id))
        alert('Produk berhasil dihapus!')
      } else {
        alert(res.data?.message || 'Gagal menghapus produk.')
      }
    } catch (err) {
      console.error('Error hapus produk:', err)
      alert('Gagal terhubung ke server.')
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* SIDEBAR */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.4 }}
        className={`${
          menuOpen ? 'block z-40' : 'hidden md:block'
        } bg-gradient-to-b from-blue-800 to-blue-900 text-white w-64 min-h-screen py-8 px-5 fixed md:sticky top-0 left-0 shadow-lg`}
      >
        <div className="mb-10">
          <h2 className="text-2xl font-bold tracking-wide">🛒 Admin Panel</h2>
          <p className="text-blue-200 text-sm">Selamat datang kembali!</p>
        </div>
        <nav className="space-y-2">
          <a
            href="/dashboard"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            <span>📊</span> <span>Dashboard</span>
          </a>
          <a
            href="#produk"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            <span>🧴</span> <span>Produk</span>
          </a>
          <a
            href="#pemesanan"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            <span>🛒</span> <span>Pemesanan</span>
          </a>
          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-700 transition text-red-100 hover:text-white"
          >
            <span>🚪</span> <span>Logout</span>
          </button>
        </nav>
      </motion.aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col ml-0 md:ml-64">
        <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">
            Dashboard Admin
          </h1>
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{currentUser.name}</p>
              <p className="text-xs text-gray-500">{currentUser.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              {currentUser.name.charAt(0)}
            </div>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-gray-600 focus:outline-none"
            >
              ☰
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-8">
          {/* Statistik */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-md">
              <h3 className="text-lg font-medium opacity-90">Jumlah Produk</h3>
              <p className="text-3xl font-bold mt-2">{produk.length}</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-2xl shadow-md">
              <h3 className="text-lg font-medium opacity-90">
                Total Pemesanan
              </h3>
              <p className="text-3xl font-bold mt-2">{pemesanan.length}</p>
            </div>
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6 rounded-2xl shadow-md">
              <h3 className="text-lg font-medium opacity-90">Pending</h3>
              <p className="text-3xl font-bold mt-2">
                {pemesanan.filter((p) => p.status === 'Pending').length}
              </p>
            </div>
          </motion.div>

          {/* Tombol Laporan */}
          <button
            onClick={() => window.open(`${API_BASE}/laporan_pdf.php`, '_blank')}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-sm font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Unduh Laporan Bulanan
          </button>

          {/* Produk */}
          <motion.section
            id="produk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-blue-800">
                Daftar Produk
              </h2>
              <button
                onClick={() => setShowTambahProduk(true)}
                className="mt-3 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition"
              >
                + Tambah Produk
              </button>
            </div>

            <div className="overflow-x-auto -mx-2 px-2">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="text-xs uppercase bg-gray-50 text-gray-500">
                  <tr>
                    <th className="py-3 px-4">Foto</th>
                    <th className="py-3 px-4">Nama</th>
                    <th className="py-3 px-4">Deskripsi</th>
                    <th className="py-3 px-4">Harga</th>
                    <th className="py-3 px-4">Stok</th>
                    <th className="py-3 px-4">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {produk.length > 0 ? (
                    produk.map((p) => (
                      <tr
                        key={p.produk_id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          {p.gambar ? (
                            <img
                              src={`${API_BASE}/${p.gambar}`}
                              alt={p.nama}
                              className="w-10 h-10 object-contain"
                              onError={(e) =>
                                (e.currentTarget.src = '/logo192.png')
                              }
                            />
                          ) : (
                            <span className="text-gray-400">–</span>
                          )}
                        </td>
                        <td className="py-3 px-4">{p.nama}</td>
                        <td className="py-3 px-4">
                          {p.deskripsi ? (
                            p.deskripsi
                          ) : (
                            <span className="text-gray-400">–</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          Rp {Number(p.harga).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">{p.stok}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() =>
                              handleHapusProduk(p.produk_id, p.nama)
                            }
                            className="text-xs bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded transition"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-6 text-center text-gray-500"
                      >
                        Tidak ada data produk
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.section>

          {/* Pemesanan */}
          <motion.section
            id="pemesanan"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <h2 className="text-xl font-semibold text-blue-800 mb-5">
              Daftar Pemesanan
            </h2>
            <div className="overflow-x-auto -mx-2 px-2">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="text-xs uppercase bg-gray-50 text-gray-500">
                  <tr>
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Nama</th>
                    <th className="py-3 px-4">Produk</th>
                    <th className="py-3 px-4">Jumlah</th>
                    <th className="py-3 px-4">Alamat</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pemesanan.length > 0 ? (
                    pemesanan.map((row, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-mono">
                          {row.id_pemesanan}
                        </td>
                        <td className="py-3 px-4">{row.nama}</td>
                        <td className="py-3 px-4">{row.produk}</td>
                        <td className="py-3 px-4 text-center">{row.jumlah}</td>
                        <td className="py-3 px-4 max-w-xs truncate">
                          {row.alamat}
                        </td>
                        <td className="py-3 px-4">
                          {updatingId === row.id_pemesanan ? (
                            <span className="text-xs text-gray-500">
                              Memproses...
                            </span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                                  row.status === 'Selesai'
                                    ? 'bg-green-500'
                                    : row.status === 'Diantar'
                                    ? 'bg-amber-500'
                                    : 'bg-gray-500'
                                }`}
                              >
                                {row.status}
                              </span>
                              {row.status !== 'Selesai' && (
                                <button
                                  onClick={() =>
                                    updateStatus(row.id_pemesanan, row.status)
                                  }
                                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded whitespace-nowrap transition"
                                >
                                  {row.status === 'Pending'
                                    ? 'Mulai Kirim'
                                    : 'Tandai Selesai'}
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-6 text-center text-gray-500"
                      >
                        Tidak ada data pemesanan
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.section>
        </main>
      </div>

      {/* Modal Tambah Produk */}
      {showTambahProduk && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
          >
            <h3 className="text-xl font-bold text-center text-gray-800 mb-4">
              Tambah Produk Baru
            </h3>
            <input
              type="text"
              placeholder="Nama Produk"
              value={newProduct.nama}
              onChange={(e) =>
                setNewProduct({ ...newProduct, nama: e.target.value })
              }
              className="w-full mb-3 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="text"
              placeholder="Deskripsi"
              value={newProduct.deskripsi}
              onChange={(e) =>
                setNewProduct({ ...newProduct, deskripsi: e.target.value })
              }
              className="w-full mb-3 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="number"
              placeholder="Harga"
              value={newProduct.harga}
              onChange={(e) =>
                setNewProduct({ ...newProduct, harga: e.target.value })
              }
              className="w-full mb-3 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="number"
              placeholder="Stok"
              value={newProduct.stok}
              onChange={(e) =>
                setNewProduct({ ...newProduct, stok: e.target.value })
              }
              className="w-full mb-3 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Foto Produk (opsional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-sm text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {previewGambar && (
                <div className="mt-2 flex justify-center">
                  <img
                    src={previewGambar}
                    alt="Preview"
                    className="w-20 h-20 object-contain"
                  />
                </div>
              )}
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleTambahProduk}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Simpan
              </button>
              <button
                onClick={() => {
                  setShowTambahProduk(false)
                  setGambarFile(null)
                  setPreviewGambar(null)
                }}
                className="bg-gray-200 text-gray-800 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-300 transition"
              >
                Batal
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal Logout */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm">
            <p className="mb-4 text-gray-700">
              Apakah Anda yakin ingin keluar?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={confirmLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Ya, Logout
              </button>
              <button
                onClick={cancelLogout}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
