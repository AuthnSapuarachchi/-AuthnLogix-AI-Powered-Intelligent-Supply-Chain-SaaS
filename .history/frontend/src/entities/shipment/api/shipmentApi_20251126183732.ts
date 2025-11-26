import { api } from "../../../shared/api/axios";
import { CreateShipmentPayload, Shipment } from "../model/types";

export const fetchShipments = async (): Promise<Shipment[]> => {
  const response = await api.get<Shipment[]>("/shipments");
  return response.data;
};

export const createShipment = async (data: CreateShipmentPayload): Promise<Shipment> => {
  const response = await api.post<Shipment>("/shipments", data);
  return response.data;
};