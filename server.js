import express from "express";
import dotenv from "dotenv";
import { connectdb } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

// DB Connection
connectdb();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);

app.listen(process.env.PORT, () => {
  console.log("server is running on port ", process.env.PORT);
});
