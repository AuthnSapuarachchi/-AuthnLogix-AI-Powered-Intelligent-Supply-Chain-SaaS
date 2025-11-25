import axios from 'axios';

// Create a configured instance
export const api = axios.create({
  // We point to /api so Vite can proxy it to Spring Boot (Port 8080)
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add an interceptor to log errors (Professional Debugging)
api.interceptors.response.use(
  (config) => {
    // 1. Grab token from Zustand Store (Accessing state outside a component!)
    const token = useAuthStore.getState().token;

    // 2. If token exists, attach it to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);