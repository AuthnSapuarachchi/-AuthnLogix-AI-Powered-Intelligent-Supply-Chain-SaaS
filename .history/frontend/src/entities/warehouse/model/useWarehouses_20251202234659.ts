import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createWarehouse, fetchWarehouses, deleteWarehouse } from "../api/warehouseApi";
import type { CreateWarehousePayload } from "./types";
import { toast } from "sonner";
import { Warehouse } from "./types";

// 1. Hook to Get All Warehouses
export const useWarehouses = () => {
  return useQuery({
    queryKey: ['warehouses'],
    queryFn: fetchWarehouses,
  });
};

// 2. Hook to Create a Warehouse
export const useCreateWarehouse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWarehousePayload) => createWarehouse(data),
    onSuccess: () => {
      // 🪄 MAGIC: This tells React Query "The list is old. Refetch it!"
      // The UI will update automatically without us touching the state.
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      toast.success("Warehouse Created Successfully!");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to create warehouse";
      toast.error(msg);
    }
  });
};

export const useDeleteWarehouse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteWarehouse(id),
    onSuccess: () => {
      // Force refetch the warehouses list
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      queryClient.refetchQueries({ queryKey: ['warehouses'] });
      toast.success("Warehouse Archived Successfully!");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to archive warehouse";
      toast.error(msg);
      console.error("Delete warehouse error:", error);
    }
  });
};

export const useUpdateWarehouse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string; payload: CreateWarehousePayload }) => 
      api.put(`/warehouses/${data.id}`, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      toast.success("Warehouse Updated");
    },
    onError: () => toast.error("Failed to update")
  });
};