export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  createdAt: string;
  // Note: We won't see nested warehouse details here yet because of @JsonIgnore in backend
}

export interface CreateProductPayload {
  name: string;
  sku: string;
  price: number;
  quantity: number;
  warehouseId: string; // The link!
}