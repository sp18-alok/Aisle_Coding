import express from "express";
import textRoutes from "./textExtractor/routes/textExtractorRoutes";
import salesTaxRoutes from "./salesTax/routes/salesTaxRoutes";

const app = express();
app.use(express.json());

app.use((_, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    next();
});

app.use("/api", textRoutes);
app.use("/api", salesTaxRoutes);

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(PORT, "0.0.0.0");