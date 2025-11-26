import { api } from "../../../shared/api/axios";
import  { CreateWarehousePayload, Warehouse } from "../model/types";

export const fetchWarehouses = async (): Promise<Warehouse[]> => {
  const response = await api.get<Warehouse[]>("/warehouses");
  return response.data;
};

export const createWarehouse = async (data: CreateWarehousePayload): Promise<Warehouse> => {
  const response = await api.post<Warehouse>("/warehouses", data);
  return response.data;
};