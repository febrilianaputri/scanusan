import type { Product, Transaction, Scanner, Supplier, User } from '../types';

export const products: Product[] = [
  { id: '1', name: 'CAT6 UTP Cable', barcode: '899001234567', category: 'Networking', currentStock: 35, unit: 'pcs', minStock: 10, status: 'good', location: 'Rack A-01', supplier: 'TechNet Supply' },
  { id: '2', name: 'RJ45 Connector', barcode: '899002345678', category: 'Networking', currentStock: 8, unit: 'pcs', minStock: 10, status: 'low', location: 'Rack A-02', supplier: 'TechNet Supply' },
  { id: '3', name: 'HDMI Cable 2m', barcode: '899003456789', category: 'Accessories', currentStock: 0, unit: 'pcs', minStock: 5, status: 'out', location: 'Rack B-01', supplier: 'CablesPlus' },
  { id: '4', name: 'USB-C Adapter', barcode: '899004567890', category: 'Accessories', currentStock: 4, unit: 'pcs', minStock: 8, status: 'low', location: 'Rack B-02', supplier: 'CablesPlus' },
  { id: '5', name: 'Network Switch 24P', barcode: '899005678901', category: 'Networking', currentStock: 12, unit: 'unit', minStock: 3, status: 'good', location: 'Rack C-01', supplier: 'NetGear Pro' },
  { id: '6', name: 'Fiber Optic Patch', barcode: '899006789012', category: 'Fiber', currentStock: 50, unit: 'pcs', minStock: 15, status: 'good', location: 'Rack C-02', supplier: 'FiberTech' },
  { id: '7', name: 'Wireless Router AC', barcode: '899007890123', category: 'Networking', currentStock: 6, unit: 'unit', minStock: 5, status: 'good', location: 'Rack D-01', supplier: 'NetGear Pro' },
  { id: '8', name: 'Ethernet Switch 8P', barcode: '899008901234', category: 'Networking', currentStock: 0, unit: 'unit', minStock: 2, status: 'out', location: 'Rack D-02', supplier: 'NetGear Pro' },
];

export const transactions: Transaction[] = [
  { id: 't1', time: '10:32:21', barcode: '899001234567', product: 'CAT6 UTP Cable', type: 'out', quantity: 5, prevStock: 40, currentStock: 35, scanner: 'Scanner-01', user: 'admin' },
  { id: 't2', time: '10:31:02', barcode: '899002345678', product: 'RJ45 Connector', type: 'in', quantity: 20, prevStock: 0, currentStock: 20, scanner: 'Scanner-01', user: 'operator1' },
  { id: 't3', time: '10:28:45', barcode: '899005678901', product: 'Network Switch 24P', type: 'in', quantity: 5, prevStock: 7, currentStock: 12, scanner: 'Scanner-01', user: 'admin' },
  { id: 't4', time: '10:15:30', barcode: '899003456789', product: 'HDMI Cable 2m', type: 'out', quantity: 3, prevStock: 3, currentStock: 0, scanner: 'Scanner-02', user: 'operator1' },
  { id: 't5', time: '09:52:10', barcode: '899006789012', product: 'Fiber Optic Patch', type: 'in', quantity: 30, prevStock: 20, currentStock: 50, scanner: 'Scanner-01', user: 'admin' },
  { id: 't6', time: '09:40:05', barcode: '899004567890', product: 'USB-C Adapter', type: 'out', quantity: 2, prevStock: 6, currentStock: 4, scanner: 'Scanner-02', user: 'operator1' },
  { id: 't7', time: '09:22:33', barcode: '899007890123', product: 'Wireless Router AC', type: 'in', quantity: 6, prevStock: 0, currentStock: 6, scanner: 'Scanner-01', user: 'admin' },
  { id: 't8', time: '09:05:18', barcode: '899001234567', product: 'CAT6 UTP Cable', type: 'in', quantity: 25, prevStock: 15, currentStock: 40, scanner: 'Scanner-01', user: 'operator1' },
];

export const scanners: Scanner[] = [
  {
    id: 's1', name: 'Scanner-01', status: 'online', wifi: 'Excellent', battery: 72,
    lastScan: '10:32:21', totalScans: 248, ipAddress: '192.168.1.101',
    firmware: 'v2.4.1', uptime: '14h 23m',
  },
  {
    id: 's2', name: 'Scanner-02', status: 'offline', wifi: 'N/A', battery: 15,
    lastScan: '08:12:05', totalScans: 89, ipAddress: '192.168.1.102',
    firmware: 'v2.3.8', uptime: '0h 0m', lastSeen: '2 hours ago',
  },
];

export const suppliers: Supplier[] = [
  { id: 'sup1', name: 'TechNet Supply', contact: 'contact@technet.com', products: 42, lastTransaction: '2026-09-15', status: 'active' },
  { id: 'sup2', name: 'CablesPlus', contact: 'sales@cablesplus.com', products: 28, lastTransaction: '2026-09-10', status: 'active' },
  { id: 'sup3', name: 'NetGear Pro', contact: 'orders@netgearpro.com', products: 35, lastTransaction: '2026-09-17', status: 'active' },
  { id: 'sup4', name: 'FiberTech', contact: 'info@fibertech.co', products: 19, lastTransaction: '2026-08-28', status: 'inactive' },
];

export const users: User[] = [
  { id: 'u1', name: 'Ahmad Rizki', email: 'admin@kami.inv', role: 'admin', status: 'active', lastActivity: '10:32 today' },
  { id: 'u2', name: 'Siti Rahayu', email: 'siti@kami.inv', role: 'operator', status: 'active', lastActivity: '09:55 today' },
  { id: 'u3', name: 'Budi Santoso', email: 'budi@kami.inv', role: 'operator', status: 'active', lastActivity: 'Yesterday' },
  { id: 'u4', name: 'Dewi Lestari', email: 'dewi@kami.inv', role: 'operator', status: 'inactive', lastActivity: '3 days ago' },
];

export const stockMovementData = [
  { time: '00:00', in: 0, out: 0 },
  { time: '02:00', in: 0, out: 0 },
  { time: '04:00', in: 0, out: 0 },
  { time: '06:00', in: 10, out: 5 },
  { time: '08:00', in: 35, out: 12 },
  { time: '09:00', in: 56, out: 22 },
  { time: '10:00', in: 80, out: 48 },
  { time: '10:32', in: 120, out: 85 },
];

export const weeklyData = [
  { day: 'Mon', in: 85, out: 42 },
  { day: 'Tue', in: 120, out: 95 },
  { day: 'Wed', in: 65, out: 78 },
  { day: 'Thu', in: 145, out: 110 },
  { day: 'Fri', in: 90, out: 55 },
  { day: 'Sat', in: 30, out: 25 },
  { day: 'Sun', in: 15, out: 8 },
];

export const monthlyData = [
  { week: 'W1', in: 420, out: 350 },
  { week: 'W2', in: 580, out: 490 },
  { week: 'W3', in: 390, out: 320 },
  { week: 'W4', in: 510, out: 445 },
];
