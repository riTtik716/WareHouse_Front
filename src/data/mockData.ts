import type { Warehouse, Zone, Rack, Shelf, Bin, Product } from '@/types/wms';

export const warehouses: Warehouse[] = [
  { id: '1', code: 'WH-MAIN-01', name: 'Central Distribution Hub', type: 'Main Facility', zonesCount: 12, status: 'Active' },
  { id: '2', code: 'WH-COLD-02', name: 'Cold Storage Unit A', type: 'Refrigerated', zonesCount: 4, status: 'Active' },
  { id: '3', code: 'WH-ZONE-03', name: 'Third-Party Logistics Point', type: '3PL Partner', zonesCount: 2, status: 'In Maintenance' },
  { id: '4', code: 'WH-RTRN-04', name: 'Returns & Processing Center', type: 'Processing', zonesCount: 6, status: 'Active' },
  { id: '5', code: 'WH-EAST-05', name: 'Eastern Regional Annex', type: 'Satellite Facility', zonesCount: 0, status: 'Inactive' },
];

export const zones: Zone[] = [
  { id: '1', name: 'FAST-PICK-A', warehouseCode: 'WH-MAIN-01', type: 'PICKING', pickPriority: 1, putAwayPriority: 5, status: 'Active' },
  { id: '2', name: 'BULK-STORAGE-01', warehouseCode: 'WH-MAIN-01', type: 'STORAGE', pickPriority: 10, putAwayPriority: 1, status: 'Active' },
  { id: '3', name: 'COLD-VAL-A', warehouseCode: 'WH-COLD-02', type: 'REFRIGERATED', pickPriority: 2, putAwayPriority: 2, status: 'Active' },
  { id: '4', name: 'QA-HOLD-01', warehouseCode: 'WH-RTRN-04', type: 'QUALITY_CONTROL', pickPriority: 99, putAwayPriority: 3, status: 'Inactive' },
  { id: '5', name: 'SHIP-STAGE-E', warehouseCode: 'WH-EAST-05', type: 'STAGING', pickPriority: 1, putAwayPriority: 20, status: 'Active' },
];

export const racks: Rack[] = [
  { id: '1', code: 'RCK-A01-01', zoneName: 'Fast Moving Zone', type: 'PALLET', aisle: 'Aisle 01', pickSequence: 100, status: 'Active' },
  { id: '2', code: 'RCK-A01-02', zoneName: 'Fast Moving Zone', type: 'PALLET', aisle: 'Aisle 01', pickSequence: 110, status: 'Active' },
  { id: '3', code: 'RCK-M01-01', zoneName: 'Hazardous Goods', type: 'MOBILE', aisle: 'Aisle 05', pickSequence: 500, status: 'Maintenance' },
  { id: '4', code: 'RCK-S02-01', zoneName: 'Small Parts Zone', type: 'STATIC', aisle: 'Aisle 02', pickSequence: 205, status: 'Active' },
  { id: '5', code: 'RCK-C01-01', zoneName: 'Cold Storage', type: 'DRIVE-IN', aisle: 'Aisle 09', pickSequence: 900, status: 'Inactive' },
];

export const shelves: Shelf[] = [
  { id: '1', code: 'SH-01-A-01', rackCode: 'RK-A1-001', levelNumber: 1, pickSequence: 101, maxWeight: 500, status: 'Active' },
  { id: '2', code: 'SH-01-A-02', rackCode: 'RK-A1-001', levelNumber: 2, pickSequence: 102, maxWeight: 500, status: 'Active' },
  { id: '3', code: 'SH-01-A-03', rackCode: 'RK-A1-001', levelNumber: 3, pickSequence: 103, maxWeight: 300, status: 'Active' },
  { id: '4', code: 'SH-01-B-01', rackCode: 'RK-B1-002', levelNumber: 1, pickSequence: 201, maxWeight: 750, status: 'Active' },
  { id: '5', code: 'SH-02-C-01', rackCode: 'RK-C2-005', levelNumber: 1, pickSequence: 512, maxWeight: 450, status: 'Active' },
];

export const bins: Bin[] = [
  { id: '1', code: 'BIN-A1-01-001', shelfCode: 'SHF-A1-01', type: 'STORAGE', capacity: 500, qty: 'Available', status: 'Active' },
  { id: '2', code: 'BIN-QC-01-02', shelfCode: 'SHF-QC-01', type: 'QC', capacity: 100, qty: 'Full', status: 'Active' },
  { id: '3', code: 'BIN-PK-03-12', shelfCode: 'SHF-PK-03', type: 'PICKING', capacity: 250, qty: 'Available', status: 'Active' },
  { id: '4', code: 'BIN-ST-05-88', shelfCode: 'SHF-ST-05', type: 'STAGING', capacity: 1200, qty: 'Blocked', status: 'Inactive' },
];

export const products: Product[] = [
  { id: '1', sku: '#PRO-9921', name: 'MacBook Pro M3 14"', category: 'Electronics', purchasePrice: 1499, salePrice: 1999, status: 'Active', currentStock: 87, location: 'Aisle 1, Bin 15', stockStatus: 'Healthy' },
  { id: '2', sku: '#PRO-4452', name: 'Sony WH-1000XM5', category: 'Electronics', purchasePrice: 299, salePrice: 349, status: 'Active', currentStock: 1240, location: 'Aisle 2, Bin 12', stockStatus: 'Healthy' },
  { id: '3', sku: '#PRO-1123', name: 'Ergonomic Desk', category: 'Furniture', purchasePrice: 450, salePrice: 650, status: 'Inactive', currentStock: 12, location: 'Aisle 4, Bin 01', stockStatus: 'Low Stock' },
  { id: '4', sku: '#PRO-5561', name: 'Smart Watch Series 9', category: 'Electronics', purchasePrice: 320, salePrice: 399, status: 'Active', currentStock: 420, location: 'Aisle 1, Bin 15', stockStatus: 'Healthy' },
  { id: '5', sku: '#PRO-8812', name: 'Nespresso Vertuo', category: 'Appliances', purchasePrice: 150, salePrice: 189, status: 'Active', currentStock: 65, location: 'Aisle 3, Bin 07', stockStatus: 'Healthy' },
  { id: '6', sku: '#PRO-3301', name: 'Premium Wireless Headphones', category: 'Electronics', purchasePrice: 180, salePrice: 249, status: 'Active', currentStock: 8, location: 'Aisle 2, Bin 05', stockStatus: 'Low Stock' },
  { id: '7', sku: '#PRO-7743', name: 'Ultra-Wide Gaming Monitor', category: 'Electronics', purchasePrice: 680, salePrice: 899, status: 'Active', currentStock: 420, location: 'Aisle 1, Bin 15', stockStatus: 'Healthy' },
];
