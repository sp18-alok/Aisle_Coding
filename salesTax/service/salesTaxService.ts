export type Item = {
  quantity: number;
  imported: boolean;
  itemName: string;
  price: number;
};

export type Receipt = {
  lines: string[];
  taxes: number;
  total: number;
};

const EXEMPT_ITEMS = [
  "book", "books",
  "chocolate", "chocolates", "chocolate bar",
  "pill", "pills", "headache", "headache pills",
  "food"
];

function isExempt(itemName: string): boolean {
  const name = itemName.toLowerCase();
  return EXEMPT_ITEMS.some(ex => name.includes(ex));
}

function roundUpToNearest005(amount: number): number {
  return Math.ceil(amount * 20) / 20;
}

function normalizeItems(raw: any[]): Item[] {
  return (raw ?? [])
    .map((it): Item | null => {
      if (!it) return null;
      const quantity = Number(it.quantity);
      const imported = Boolean(it.imported);
      const itemName = String(it.itemName ?? it.name ?? "");
      const price =
        typeof it.price === "number"
          ? it.price
          : typeof it.priceCents === "number"
          ? it.priceCents / 100
          : NaN;

      if (!itemName || !Number.isFinite(quantity) || !Number.isFinite(price)) return null;
      return { quantity, imported, itemName, price };
    })
    .filter((x): x is Item => x !== null);
}

export class SalesTaxService {
  constructor(private readonly textApiUrl: string) {}

  async fetchItems(): Promise<Item[]> {
    const response = await fetch(this.textApiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch items: ${response.status}`);
    }
    const payload = await response.json();
    const rawItems =
      (payload && payload.items) ??
      (payload && payload.data && payload.data.items) ??
      [];
    return normalizeItems(rawItems);
  }

  computeReceipt(items: Item[]): Receipt {
    let totalTaxes = 0;
    let totalAmount = 0;
    const lines: string[] = [];

    for (const item of items) {
      const basePrice = item.price;
      let taxRate = 0;

      if (!isExempt(item.itemName)) taxRate += 0.10;
      if (item.imported) taxRate += 0.05;

      const taxPerItem = roundUpToNearest005(basePrice * taxRate);
      const priceWithTax = basePrice + taxPerItem;
      const lineTotal = priceWithTax * item.quantity;

      totalTaxes += taxPerItem * item.quantity;
      totalAmount += lineTotal;

      const displayName =
        item.imported && !item.itemName.toLowerCase().startsWith("imported ")
          ? `imported ${item.itemName}`
          : item.itemName;

      lines.push(`${item.quantity} ${displayName}: ${lineTotal.toFixed(2)}`);
    }

    return {
      lines,
      taxes: Number(totalTaxes.toFixed(2)),
      total: Number(totalAmount.toFixed(2)),
    };
  }
}