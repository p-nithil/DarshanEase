/**
 * Centralized Axios instance for DarshanEase.
 *
 * In production (Vercel), set NEXT_PUBLIC_BACKEND_URL to your Render backend URL.
 * e.g.  NEXT_PUBLIC_BACKEND_URL=https://darshanease-api-xxxx.onrender.com
 *
 * In local development, leave it unset — requests will hit /api/... which
 * Next.js rewrites to http://localhost:5000/api/...
 */
import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

// Create instance — baseURL is the Render URL in production, empty in local dev
const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

// Attach stored JWT as Bearer token on every request (cross-domain auth)
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('darshan_token');
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
