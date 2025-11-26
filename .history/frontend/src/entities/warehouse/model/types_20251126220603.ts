export interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
  createdAt: string;
  
}

export interface CreateWarehousePayload {
  name: string;
  location: string;
  capacity: number;
}