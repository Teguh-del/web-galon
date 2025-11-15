import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-blue-600 text-white py-4 shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6">
        <div className="flex items-center space-x-2">
          <img
            src="/logo192.png"
            alt="GalonKu Logo"
            className="w-8 h-8 rounded-md object-cover" 
          />
          <h1 className="text-xl font-bold">GalonKu</h1>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden focus:outline-none"
        >
          ☰
        </button>
        <nav
          className={`${
            open ? 'block' : 'hidden'
          } md:flex space-y-3 md:space-y-0 md:space-x-6 absolute md:static top-16 left-0 md:bg-transparent bg-blue-700 w-full md:w-auto px-6 md:px-0 py-4 md:py-0`}
        >
          <Link to="/" onClick={() => setOpen(false)} className="block">
            Beranda
          </Link>
          <Link to="/produk" onClick={() => setOpen(false)} className="block">
            Produk
          </Link>
          <Link to="/login" onClick={() => setOpen(false)} className="block ">
            Login
          </Link>
        </nav>
      </div>
    </header>
  )
}