export interface WarehouseStat {
  warehouseName: string;
  productCount: number;
}

export interface AnalyticsResponse {
  totalInventoryValue: number;
  totalProducts: number;
  lowStockItems: number;
  warehouseDistribution: WarehouseStat[];
}