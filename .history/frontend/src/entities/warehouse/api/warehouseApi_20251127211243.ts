import { api } from "../../../shared/api/axios";
import type { CreateWarehousePayload, Warehouse } from "../model/types";

export const fetchWarehouses = async (): Promise<Warehouse[]> => {
  const response = await api.get<Warehouse[]>("/warehouses");
  return response.data;
};

export const createWarehouse = async (data: CreateWarehousePayload): Promise<Warehouse> => {
  const response = await api.post<Warehouse>("/warehouses", data);
  return response.data;
};

export const deleteWarehouse = async (id: string): Promise<void> => {
  await api.delete(`/warehouses/${id}`);
};