import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-blue-600 text-white py-8 px-6 mt-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <div>
          <p>📍 Jl. Melati No. 23, Gorontalo</p>
          <p>📞 0815-3456-7890</p>
          <p>✉️ info@GalonKu.com</p>
        </div>
        <div className="flex space-x-4">
          <a href="https://facebook.com" className="hover:text-blue-300">
            Facebook
          </a>
          <a href="https://instagram.com" className="hover:text-pink-300">
            Instagram
          </a>
          <a
            href="https://wa.me/6281527630838"
            className="hover:text-green-300"
          >
            WhatsApp
          </a>
        </div>
      </div>
      <div className="text-center border-t border-blue-400 mt-4 pt-3 text-sm text-blue-200">
        © 2025 GalonKu. All rights reserved.
      </div>
    </footer>
  )
}