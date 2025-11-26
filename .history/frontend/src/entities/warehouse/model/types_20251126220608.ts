export interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
  createdAt: string;
  latitude: number;
  longitude: number;
}

export interface CreateWarehousePayload {
  name: string;
  location: string;
  capacity: number;
  latitude: number;
  longitude: number;
}