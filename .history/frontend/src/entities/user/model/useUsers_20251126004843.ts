import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../api/userApi";

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'], // Unique key for caching
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
  });
};