import { Router } from "express";
import { SalesTaxController } from "../controller/salesTaxController";
import { SalesTaxService } from "../service/salesTaxService";

const router = Router();

const TEXT_API_URL = process.env.TEXT_API_URL || "http://localhost:3000/api/text";
const service = new SalesTaxService(TEXT_API_URL);
const controller = new SalesTaxController(service);

router.get("/receipt", controller.fromTextApi);

export default router;
