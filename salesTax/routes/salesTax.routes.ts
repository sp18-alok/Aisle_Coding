// salesTax/routes/salesTax.routes.ts
import { Router } from "express";
import { SalesTaxController } from "../controller/salesTax.controller";

const r = Router();
const c = new SalesTaxController();

r.get("/receipt", c.fromTextApi);

export default r;
