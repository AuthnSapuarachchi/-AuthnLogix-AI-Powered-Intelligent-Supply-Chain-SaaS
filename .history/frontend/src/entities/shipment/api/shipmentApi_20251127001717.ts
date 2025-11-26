import { api } from "../../../shared/api/axios";
import type { CreateShipmentPayload, Shipment } from "../models/types";

export const fetchShipments = async (): Promise<Shipment[]> => {
  const response = await api.get<Shipment[]>("/shipments");
  return response.data;
};

export const createShipment = async (data: CreateShipmentPayload): Promise<Shipment> => {
  const response = await api.post<Shipment>("/shipments", data);
  return response.data;
};

export const trackShipmentPublic = async (id: string) => {
  // Note: No Authorization header needed for this one!
  // But our interceptor adds it if it exists. That's fine.
  const response = await api.get(`/public/tracking/${id}`);
  return response.data;
};