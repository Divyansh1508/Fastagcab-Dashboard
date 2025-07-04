import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import User from "../models/User.js";

// Load environment variables from server/.env
dotenv.config({ path: path.join(process.cwd(), ".env") });

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: "admin@fastagcab.com" });

    if (existingAdmin) {
      console.log("✅ Admin user already exists");
      console.log("Email:", existingAdmin.email);
      console.log("Role:", existingAdmin.role);
      return;
    }

    // Create admin user
    const adminUser = new User({
      firstName: "Admin",
      lastName: "User",
      email: "admin@fastagcab.com",
      password: "admin123",
      phone: "+1234567890",
      role: "admin",
      status: "active",
      isEmailVerified: true,
    });

    await adminUser.save();
    console.log("✅ Admin user created successfully!");
    console.log("Email: admin@fastagcab.com");
    console.log("Password: admin123");
    console.log("Role: admin");
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
  } finally {
    await mongoose.disconnect();
    console.log("📤 Disconnected from MongoDB");
  }
};

// Run the script
createAdminUser();
