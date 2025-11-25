import axios from 'axios';
import { useAuthStore } from '../../entities/session/model/authStore';

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
    console.log("🚀 Interceptor Running for URL:", config.url);
    console.log("🎫 Token in Store:", token ? "YES (Found)" : "NO (Null)");

    // 2. If token exists, attach it to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: "The Error Handler"
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 403/401, it means token is invalid/expired
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
       console.error("Session expired or invalid token");
       // Optional: You could auto-logout here
       // useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);