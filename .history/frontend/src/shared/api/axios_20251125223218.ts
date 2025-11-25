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
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);