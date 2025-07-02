import express from 'express';
import RedeemRequest from '../models/RedeemRequest.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Get redeem requests
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type } = req.query;
    
    const query = {};
    if (req.user.role !== 'admin') {
      query.user = req.user.userId;
    }
    if (status) query.status = status;
    if (type) query.type = type;

    const requests = await RedeemRequest.find(query)
      .populate('user', 'firstName lastName email')
      .populate('product', 'name price')
      .populate('processedBy', 'firstName lastName')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await RedeemRequest.countDocuments(query);

    res.json({
      requests,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get redeem requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create redeem request
router.post('/', auth, async (req, res) => {
  try {
    const { type, points, amount, productId, deliveryAddress } = req.body;

    // Check if user has enough points
    const user = await User.findById(req.user.userId);
    if (user.points < points) {
      return res.status(400).json({ message: 'Insufficient points' });
    }

    // If redeeming for a product, check availability
    let product = null;
    if (productId) {
      product = await Product.findById(productId);
      if (!product || product.stock <= 0) {
        return res.status(400).json({ message: 'Product not available' });
      }
    }

    const redeemRequest = new RedeemRequest({
      user: req.user.userId,
      type,
      points,
      amount,
      product: productId,
      deliveryAddress
    });

    await redeemRequest.save();
    await redeemRequest.populate('user', 'firstName lastName email');
    await redeemRequest.populate('product', 'name price');

    res.status(201).json(redeemRequest);
  } catch (error) {
    console.error('Create redeem request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update redeem request status (Admin only)
router.patch('/:id/status', auth, adminAuth, async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    const redeemRequest = await RedeemRequest.findById(req.params.id);
    if (!redeemRequest) {
      return res.status(404).json({ message: 'Redeem request not found' });
    }

    // If approving, deduct points from user
    if (status === 'approved' && redeemRequest.status === 'pending') {
      const user = await User.findById(redeemRequest.user);
      if (user.points < redeemRequest.points) {
        return res.status(400).json({ message: 'User has insufficient points' });
      }
      user.points -= redeemRequest.points;
      await user.save();

      // If product redemption, reduce stock
      if (redeemRequest.product) {
        const product = await Product.findById(redeemRequest.product);
        if (product && product.stock > 0) {
          product.stock -= 1;
          await product.save();
        }
      }
    }

    redeemRequest.status = status;
    redeemRequest.adminNotes = adminNotes;
    redeemRequest.processedBy = req.user.userId;
    redeemRequest.processedAt = new Date();

    await redeemRequest.save();
    await redeemRequest.populate('user', 'firstName lastName email');
    await redeemRequest.populate('product', 'name price');
    await redeemRequest.populate('processedBy', 'firstName lastName');

    res.json(redeemRequest);
  } catch (error) {
    console.error('Update redeem request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;