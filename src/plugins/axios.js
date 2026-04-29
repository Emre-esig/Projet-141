import axios from 'axios'

// URL API depuis .env (fallback fourni)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://v3.football.api-sports.io'
const API_KEY = import.meta.env.VITE_API_KEY

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'x-apisports-key': API_KEY || ''
    }
})

export default api
