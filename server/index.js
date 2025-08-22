import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import expenseRoutes from "./routes/expenseRoutes.js";
import cors from "cors";


// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env (inside server folder)
dotenv.config({ path: path.join(__dirname, ".env") });
const app = express();
app.use(cors({
  origin: "http://localhost:5173"
}));

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Debug log
console.log("📌 Loaded MONGO_URI:", process.env.MONGO_URI);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Register expense routes
app.use("/api/expenses", expenseRoutes);


// Simple test route
app.get("/", (req, res) => {
  res.send("Hello, your server is working! 🚀");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});