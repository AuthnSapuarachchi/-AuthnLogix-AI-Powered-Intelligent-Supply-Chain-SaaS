import { api } from "../../../shared/api/axios";
import type { User } from "../model/types"; // Ensure you have this type defined

// We reuse the /auth/register endpoint, but call it from inside the app!
export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'MANAGER' | 'DRIVER';
}

export const createUser = async (data: CreateUserPayload) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

// We already have fetchUsers in the other file, we can reuse it