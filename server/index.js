import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import expenseRoutes from "./routes/expenseRoutes.js";

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env (inside server folder)
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Enable CORS for frontend origin
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// ✅ Middleware
app.use(express.json());

// ✅ Debug log
console.log("📌 Loaded MONGO_URI:", process.env.MONGO_URI);

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Register expense routes
app.use("/api/expenses", expenseRoutes);

// ✅ Simple test route
app.get("/", (req, res) => {
  res.send("Hello, your server is working! 🚀");
});

// ✅ Optional fallback route
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Start server with error listener
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
}).on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use. Try a different one.`);
  } else {
    console.error("❌ Server error:", err);
  }
});