// 🌐 axios.js
// Configures Axios for all backend API calls with a common base URL.
// Automatically attaches JWT tokens to requests and handles 401 (unauthorized) responses.
// Ensures secure and consistent communication between React frontend and Spring Boot backend.

import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api