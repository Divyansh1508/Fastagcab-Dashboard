import express from 'express';
import Scheme from '../models/Scheme.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all schemes
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (status) query.status = status;

    const schemes = await Scheme.find(query)
      .populate('createdBy', 'firstName lastName')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Scheme.countDocuments(query);

    res.json({
      schemes,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get schemes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create scheme (Admin only)
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const scheme = new Scheme({
      ...req.body,
      createdBy: req.user.userId
    });

    await scheme.save();
    await scheme.populate('createdBy', 'firstName lastName');

    res.status(201).json(scheme);
  } catch (error) {
    console.error('Create scheme error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update scheme (Admin only)
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const scheme = await Scheme.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'firstName lastName');

    if (!scheme) {
      return res.status(404).json({ message: 'Scheme not found' });
    }

    res.json(scheme);
  } catch (error) {
    console.error('Update scheme error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete scheme (Admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const scheme = await Scheme.findByIdAndDelete(req.params.id);
    if (!scheme) {
      return res.status(404).json({ message: 'Scheme not found' });
    }
    res.json({ message: 'Scheme deleted successfully' });
  } catch (error) {
    console.error('Delete scheme error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;