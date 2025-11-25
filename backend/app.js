import express from "express";
import product from "./Router/productRoutes.js";
import User from "./Router/userRoutes.js";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use('/api',product);
app.use('/api/user',User);

export default app;