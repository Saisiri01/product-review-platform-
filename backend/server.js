const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.send("Product Review Platform Backend is running!");
});

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error.message);
  });

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});