const API_BASE =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost/backend' // jika pakai XAMPP di port 80
    : // ? 'http://localhost:8000'  // jika pakai php -S
      'https://yourdomain.com/backend'

export default API_BASE
