import express from "express";
import cors from "cors";
import productsRouter from "./routes/products";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({ origin: "http://localhost:5173" })); // Frontend React
app.use(express.json());

// Routes
app.use("/api/products", productsRouter);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
