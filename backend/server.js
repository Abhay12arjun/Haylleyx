require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

// Existing routes
const orderRoutes = require("./routes/orderRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// ✅ NEW auth route
const authRoutes = require("./routes/authRoutes");

const app = express();

// Connect MongoDB
connectDB();

//////////////////////////////////////////////////////
// ✅ MIDDLEWARE
//////////////////////////////////////////////////////
app.use(cors({
  origin: process.env.FRONTEND_URL, // important for Google + cookies
  credentials: true,
}));

app.use(express.json());

//////////////////////////////////////////////////////
// ✅ ROUTES
//////////////////////////////////////////////////////
app.use("/api/auth", authRoutes); // 🔥 ADD THIS

app.use("/api/orders", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);

//////////////////////////////////////////////////////
// ✅ PORT
//////////////////////////////////////////////////////
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});