import express from "express";
import helloRoute from "./routes/hello"

const app = express();
const PORT = 5000;

app.use(express.json());
app.use("/api/hello", helloRoute);

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});