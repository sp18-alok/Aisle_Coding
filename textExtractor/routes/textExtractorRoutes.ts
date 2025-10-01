import { Router } from "express";
import { parseInput, getItemData } from "../controller/textExtractorController";

const router = Router();

router.post("/text", parseInput);
router.get("/text", getItemData);

export default router;