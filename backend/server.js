import dotenv from "dotenv";
import express from "express";
import cors from "cors";


import customerRoutes from "./routes/customers.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import userRoutes from "./routes/userRoutes.js"; // <-- added users
import authRoutes from "./routes/authRoutes.js";




dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes); // <-- added users

// Root route
app.get("/", (req, res) => res.json({ message: "API running with Postgres 🚀" }));

// Catch-all 404 for API routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
