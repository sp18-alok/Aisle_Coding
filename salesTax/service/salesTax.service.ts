// salesTax/service/salesTax.service.ts
export type Item = { 
    quantity: number; 
    imported: boolean; 
    itemName: string; 
    price: number 
};
  
const EXEMPT_ITEMS = [
    "book", "books",
    "chocolate", "chocolates", "chocolate bar",
    "pill", "pills", "headache", "headache pills",
    "food"
];
  
export function isExempt(itemName: string): boolean {
    const name = itemName.toLowerCase();
    return EXEMPT_ITEMS.some(exempt => name.includes(exempt));
}
  
export function roundUpToNearest005(amount: number): number {
    return Math.ceil(amount * 20) / 20;
}
  
export function computeReceipt(items: Item[]) {
    let totalTaxes = 0;
    let totalAmount = 0;
    const lines: string[] = [];
  
    for (const item of items) {
      const basePrice = item.price;
      let taxRate = 0;
      
      if (!isExempt(item.itemName)) {
        taxRate += 0.10;
      }
      
      if (item.imported) {
        taxRate += 0.05;
      }
  
      const taxPerItem = roundUpToNearest005(basePrice * taxRate);
      const priceWithTax = basePrice + taxPerItem;
      const lineTotal = priceWithTax * item.quantity;
  
      totalTaxes += taxPerItem * item.quantity;
      totalAmount += lineTotal;
  
      const displayName = item.imported && !item.itemName.toLowerCase().startsWith("imported ")
        ? `imported ${item.itemName}` 
        : item.itemName;
  
      lines.push(`${item.quantity} ${displayName}: ${lineTotal.toFixed(2)}`);
    }
  
    return { 
      lines, 
      taxes: Number(totalTaxes.toFixed(2)), 
      total: Number(totalAmount.toFixed(2)) 
    };
}