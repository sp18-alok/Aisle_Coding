import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { SalesTaxService } from "../service/salesTaxService";

export class SalesTaxController {
  constructor(private readonly service: SalesTaxService) {}

  fromTextApi = asyncHandler(async (_req: Request, res: Response) => {

    const items = await this.service.fetchItems();
    const receipt = this.service.computeReceipt(items);

    return void res.json({ items, receipt });
  });
}
