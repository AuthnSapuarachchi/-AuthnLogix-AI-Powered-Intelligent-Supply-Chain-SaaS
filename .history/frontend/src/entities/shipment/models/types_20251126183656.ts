// We need the Product type to display the name in the table
import { Product } from "../../product/model/types";

export interface Shipment {
  id: string;
  destination: string;
  quantity: number;
  status: 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  shipmentDate: string;
  product: Product; // Nested object from backend
}

export interface CreateShipmentPayload {
  productId: string;
  quantity: number;
  destination: string;
}