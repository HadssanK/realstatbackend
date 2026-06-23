import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectdb } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { getAllCategories } from "./controllers/adminController.js";

const app = express();
app.use(express.json());

connectdb();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/admin", adminRoutes);

// Public categories (frontend dropdown ke liye)
app.get("/api/categories", getAllCategories);

app.listen(process.env.PORT, () => {
  console.log("server is running on port ", process.env.PORT);
});
