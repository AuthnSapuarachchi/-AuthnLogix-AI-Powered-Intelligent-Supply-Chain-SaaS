import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createShipment, fetchShipments } from "../api/shipmentApi";
import type { CreateShipmentPayload } from "./types";
import { toast } from "sonner";

export const useShipments = () => {
  return useQuery({
    queryKey: ['shipments'],
    queryFn: fetchShipments,
  });
};

export const useCreateShipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateShipmentPayload) => createShipment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      // CRITICAL: We must also refresh Products because stock decreased!
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success("Shipment Created Successfully!");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Transaction Failed";
      alert("Error: " + msg);
    }
  });
};