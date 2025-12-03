import { api } from "../../../shared/api/axios";
import type { CreateProductPayload, Product } from "../model/types";

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await api.get<Product[]>("/products");
  return response.data;
};

export const createProduct = async (data: CreateProductPayload): Promise<Product> => {
  const response = await api.post<Product>("/products", data);
  return response.data;
};

export const updateProduct = async (id: string, data: CreateProductPayload): Promise<Product> => {
  const response = await api.put<Product>(`/products/${id}`, data);
  return response.data;
};