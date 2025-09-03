import express from "express";
import productsRoute from "./routes/products";

const app = express();
const PORT = 5000;

app.use(express.json());

app.use("/api/products", productsRoute);

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});