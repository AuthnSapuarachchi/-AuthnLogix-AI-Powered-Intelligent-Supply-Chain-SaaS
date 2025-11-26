import axios, { AxiosHeaders } from 'axios';
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
api.interceptors.request.use(
  (config) => {
    // 1. Grab token from Zustand Store (Accessing state outside a component!)
    const token = useAuthStore.getState().token;

    // 2. If token exists, attach it to headers
    if (token) {
      // Ensure headers object exists and set Authorization header
      if (!config.headers) = {};
      (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;

      console.log("✅ Authorization Header Set");
    } else {
      console.warn("⚠️ Request sent without token!");
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