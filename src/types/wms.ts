export type StatusType = 'Active' | 'Inactive' | 'In Maintenance' | 'Maintenance';
export type BinStatusType = 'Available' | 'Full' | 'Blocked';
export type StockStatusType = 'Healthy' | 'Low Stock' | 'Critical';

export interface Warehouse {
  id: string;
  code: string;
  name: string;
  type: string;
  zonesCount: number;
  status: StatusType;
  contact?: string;
  phone?: string;
  email?: string;
  capacity?: number;
  volume?: number;
}

export interface Zone {
  id: string;
  name: string;
  warehouseCode: string;
  type: string;
  pickPriority: number;
  putAwayPriority: number;
  status: StatusType;
}

export interface Rack {
  id: string;
  code: string;
  zoneName: string;
  type: string;
  aisle: string;
  pickSequence: number;
  status: StatusType;
}

export interface Shelf {
  id: string;
  code: string;
  rackCode: string;
  levelNumber: number;
  pickSequence: number;
  maxWeight: number;
  status: StatusType;
}

export interface Bin {
  id: string;
  code: string;
  shelfCode: string;
  type: string;
  capacity: number;
  qty: BinStatusType;
  status: StatusType;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  purchasePrice: number;
  salePrice: number;
  status: 'Active' | 'Inactive';
  currentStock?: number;
  location?: string;
  stockStatus?: StockStatusType;
}
