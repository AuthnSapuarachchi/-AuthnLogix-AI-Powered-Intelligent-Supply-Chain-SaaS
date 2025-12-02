import { api } from "../../../shared/api/axios";

// Define the shape of the response from Spring Boot
export interface AuthResponse {
  token: string;
  role: 'ADMIN' | 'MANAGER' | 'DRIVER';
}

// Define the shape of the data we send
export interface LoginPayload {
  email: string;
  password: string;
}

export const loginUser = async (data: LoginPayload): Promise<AuthResponse> => {
  // This hits: http://localhost:5173/api/v1/auth/login
  // Which Proxies to: http://localhost:8080/api/v1/auth/login
  const response = await api.post<AuthResponse>("/auth/login", data);
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const response = await api.post("/auth/reset-password", { token, newPassword });
  return response.data;
};