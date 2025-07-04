import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import userExecutiveRoutes from "./routes/userExecutive.js";
import schemeRoutes from "./routes/schemes.js";
import productRoutes from "./routes/products.js";
import redeemRoutes from "./routes/redeem.js";
import dashboardRoutes from "./routes/dashboard.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// MongoDB Connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      console.error("❌ MONGODB_URI environment variable is not set");
      console.log("\n📋 To fix this issue:");
      console.log("1. Create a .env file in the server directory");
      console.log("2. Add your MongoDB connection string:");
      console.log("   MONGODB_URI=your_mongodb_connection_string");
      console.log("3. Make sure the .env file is in the server folder");
      console.log("\nExample .env file content:");
      console.log(
        "MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database"
      );
      console.log("JWT_SECRET=your_jwt_secret_key");
      console.log(
        "\n⚠️  Server will not start until MongoDB URI is configured."
      );
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    console.log("\n🔧 Troubleshooting steps:");
    console.log("1. Verify your MongoDB connection string is correct");
    console.log(
      "2. Check that your IP address is whitelisted in MongoDB Atlas Network Access"
    );
    console.log("3. Ensure your database user has proper permissions");
    console.log("4. Verify your username and password are correct");
    process.exit(1);
  }
};

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/user-executive", userExecutiveRoutes);
app.use("/api/schemes", schemeRoutes);
app.use("/api/products", productRoutes);
app.use("/api/redeem", redeemRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ message: "FASTAGCAB Server is running!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
