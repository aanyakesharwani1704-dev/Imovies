import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('imovies_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem('imovies_token')) {
      window.dispatchEvent(new Event('imovies:session-expired'))
    }
    return Promise.reject(error)
  },
)

export const getApiError = (error) => {
  if (error.response?.data?.message) return error.response.data.message
  if (error.response?.data?.errors?.length) {
    return error.response.data.errors.map((item) => item.message).join('. ')
  }
  if (error.code === 'ECONNABORTED') return 'The server took too long to respond. Please try again.'
  if (!error.response) return 'Cannot reach the iMovies server. Check that the backend is running.'
  return 'Something went wrong. Please try again.'
}

export default api
