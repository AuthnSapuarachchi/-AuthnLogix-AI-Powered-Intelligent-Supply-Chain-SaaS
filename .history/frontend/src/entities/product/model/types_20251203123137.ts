export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  warehouseId: string;
  createdAt: string;
}

export interface CreateProductPayload {
  name: string;
  sku: string;
  price: number;
  quantity: number;
  warehouseId: string; // The link!
}