import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import schemeRoutes from './routes/schemes.js';
import productRoutes from './routes/products.js';
import redeemRoutes from './routes/redeem.js';
import dashboardRoutes from './routes/dashboard.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri || mongoUri.includes('your-username') || mongoUri.includes('your-password')) {
      console.error('❌ MongoDB connection string not configured properly');
      console.log('\n📋 To fix this issue:');
      console.log('1. Create a free MongoDB Atlas account at: https://www.mongodb.com/atlas');
      console.log('2. Create a new cluster');
      console.log('3. Get your connection string from the "Connect" button');
      console.log('4. Replace the MONGODB_URI in your .env file with your actual connection string');
      console.log('5. Make sure to replace <username>, <password>, and <cluster-url> with your actual values');
      console.log('\nExample connection string:');
      console.log('MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/fastagcab?retryWrites=true&w=majority');
      console.log('\n⚠️  Server will not start until MongoDB is properly configured.');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Verify your MongoDB Atlas connection string is correct');
    console.log('2. Check that your IP address is whitelisted in MongoDB Atlas Network Access');
    console.log('3. Ensure your database user has proper permissions');
    console.log('4. Verify your username and password are correct');
    process.exit(1);
  }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/redeem', redeemRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ message: 'FASTAGCAB Server is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});