import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProduct, fetchProducts } from "../api/productApi";
import { CreateProductPayload } from "./types";

// 1. Fetch
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });
};

// 2. Create (Mutation)
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductPayload) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      // We also might want to refetch warehouses to see updated capacity? 
      // For now, let's just refresh products.
      alert("Product Added Successfully!");
    },
    onError: (error: any) => {
      // Use the backend error message (e.g., "Warehouse capacity exceeded!")
      const msg = error.response?.data?.message || "Failed to create product";
      alert("Error: " + msg);
    }
  });
};