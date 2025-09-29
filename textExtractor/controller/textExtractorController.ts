import { Request, Response } from "express";
import { calculateTotal, parseShoppingInput, prettyLines, Item } from "../service/textExtractorService";

let lastItems: Item[] = [];

export class TextExtractorController {
  ingest = (req: Request, res: Response) => {
    const { input } = req.body;
    
    if (!input || !input.trim()) {
      res.status(400).json({ error: "Input is required" });
      return;
    }

    lastItems = parseShoppingInput(input);
    res.json({
      message: "parsed_and_stored",
      items: lastItems
    });
  };

  getAll = (_req: Request, res: Response) => {
    const total = calculateTotal(lastItems);
    res.json({ 
      items: lastItems, 
      total, 
      lines: prettyLines(lastItems) 
    });
  };
}