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

