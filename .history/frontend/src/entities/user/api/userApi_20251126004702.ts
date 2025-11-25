import { api } from "../../../shared/api/axios";
import { User } from "../";

export const fetchUsers = async (): Promise<User[]> => {
  const response = await api.get<User[]>("/users");
  return response.data;
};