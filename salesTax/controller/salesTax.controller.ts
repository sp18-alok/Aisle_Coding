// salesTax/controller/salesTax.controller.ts
import { Request, Response } from "express";
import { computeReceipt, Item } from "../service/salesTax.service";

const TEXT_API_URL = process.env.TEXT_API_URL || "http://localhost:3000/api/text";

async function fetchItems(): Promise<Item[]> {
  const response = await fetch(TEXT_API_URL);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch items: ${response.status}`);
  }
  
  const data = await response.json();
  return data.items || [];
}

export class SalesTaxController {
  itemsOnly = async (_req: Request, res: Response) => {
    try {
      const items = await fetchItems();
      res.json({ items });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  fromTextApi = async (_req: Request, res: Response) => {
    try {
      const items = await fetchItems();
      const receipt = computeReceipt(items);
      
      res.json({ 
        lines: receipt.lines, 
        "Sales Taxes": receipt.taxes.toFixed(2), 
        "Total": receipt.total.toFixed(2) 
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}