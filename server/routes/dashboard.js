import express from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';
import RedeemRequest from '../models/RedeemRequest.js';
import Scheme from '../models/Scheme.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard statistics
router.get('/stats', auth, async (req, res) => {
  try {
    // User statistics
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ status: 'verified' });
    const unverifiedUsers = await User.countDocuments({ status: 'unverified' });
    const executives = await User.countDocuments({ role: 'executive' });

    // Product statistics
    const totalProducts = await Product.countDocuments();
    const inStockProducts = await Product.countDocuments({ stock: { $gt: 0 } });
    const outOfStockProducts = await Product.countDocuments({ stock: 0 });
    const lowStockProducts = await Product.countDocuments({ stock: { $gt: 0, $lte: 10 } });

    // Redeem statistics
    const totalRedeemRequests = await RedeemRequest.countDocuments();
    const pendingRedeems = await RedeemRequest.countDocuments({ status: 'pending' });
    const approvedRedeems = await RedeemRequest.countDocuments({ status: 'approved' });
    const completedRedeems = await RedeemRequest.countDocuments({ status: 'completed' });

    // Points statistics
    const totalPointsRedeemed = await RedeemRequest.aggregate([
      { $match: { status: { $in: ['approved', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$points' } } }
    ]);

    const totalRedeemAmount = await RedeemRequest.aggregate([
      { $match: { status: { $in: ['approved', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Recent activity
    const recentRedeems = await RedeemRequest.find()
      .populate('user', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      users: {
        total: totalUsers,
        verified: verifiedUsers,
        unverified: unverifiedUsers,
        executives: executives
      },
      products: {
        total: totalProducts,
        inStock: inStockProducts,
        outOfStock: outOfStockProducts,
        lowStock: lowStockProducts
      },
      redeems: {
        total: totalRedeemRequests,
        pending: pendingRedeems,
        approved: approvedRedeems,
        completed: completedRedeems
      },
      points: {
        totalRedeemed: totalPointsRedeemed[0]?.total || 0,
        totalAmount: totalRedeemAmount[0]?.total || 0
      },
      recentActivity: recentRedeems
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get chart data
router.get('/charts', auth, async (req, res) => {
  try {
    // User registration trend (last 6 months)
    const userTrend = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Redeem requests by status
    const redeemByStatus = await RedeemRequest.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Users by role
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      userTrend,
      redeemByStatus,
      usersByRole
    });
  } catch (error) {
    console.error('Get chart data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;