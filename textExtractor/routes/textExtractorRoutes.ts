import { Router } from "express";
import { TextExtractorController } from "../controller/textExtractorController";

const router = Router();
const controller = new TextExtractorController();

router.post("/text", controller.ingest);
router.get("/text", controller.getAll);

export default router;
