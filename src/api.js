const API_BASE =
  process.env.NODE_ENV === 'development'
    ? 'https://galon.kesug.com/api' // jika pakai XAMPP di port 80
    : // ? 'http://localhost:8000'  // jika pakai php -S
      'https://yourdomain.com/api'

export default API_BASE
