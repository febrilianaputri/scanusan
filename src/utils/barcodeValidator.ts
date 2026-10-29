import { Product } from '../types';

export function validateBarcode(scannedBarcode: string, products: Product[]) {
  if (!scannedBarcode || !scannedBarcode.trim()) {
    return { valid: false, message: 'Barcode kosong' };
  }
  const cleanBarcode = scannedBarcode.trim().toLowerCase();
  const foundProduct = products.find(
    (p) => p.barcode && p.barcode.trim().toLowerCase() === cleanBarcode
  );

  if (foundProduct) {
    return { valid: true, product: foundProduct };
  }
  return { valid: false, message: 'Barcode bukan produk resmi PT' };
}