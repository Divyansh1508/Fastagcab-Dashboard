import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import UserExecutive from '../models/UserExecutive.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/documents';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images (JPEG, JPG, PNG) and PDF files are allowed'));
    }
  }
});

// Get all users with pagination and filters
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      userType, 
      status, 
      isVerified,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};
    
    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
        { aadharNumber: { $regex: search, $options: 'i' } },
        { panNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Filters
    if (userType && userType !== 'all') query.userType = userType;
    if (status && status !== 'all') query.status = status;
    if (isVerified !== undefined && isVerified !== 'all') {
      query.isVerified = isVerified === 'true';
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const users = await UserExecutive.find(query)
      .populate('referredBy', 'name mobile')
      .populate('verifiedBy', 'firstName lastName')
      .populate('createdBy', 'firstName lastName')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await UserExecutive.countDocuments(query);
    const statistics = await UserExecutive.getStatistics();

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
      statistics
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user by ID
router.get('/:id', auth, adminAuth, async (req, res) => {
  try {
    const user = await UserExecutive.findById(req.params.id)
      .populate('referredBy', 'name mobile userType')
      .populate('referredUsers', 'name mobile userType registrationDate')
      .populate('verifiedBy', 'firstName lastName')
      .populate('createdBy', 'firstName lastName');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new user
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const {
      userType,
      name,
      dateOfBirth,
      relationshipStatus,
      mobile,
      email,
      aadharNumber,
      panNumber,
      pinCode,
      state,
      city,
      address,
      password,
      pointPercentage,
      referCode,
      dealerCode
    } = req.body;

    // Check for existing user with same mobile, aadhar, or pan
    const existingUser = await UserExecutive.findOne({
      $or: [
        { mobile },
        { aadharNumber },
        { panNumber }
      ]
    });

    if (existingUser) {
      let field = 'mobile';
      if (existingUser.aadharNumber === aadharNumber) field = 'Aadhar number';
      if (existingUser.panNumber === panNumber) field = 'PAN number';
      return res.status(400).json({ 
        message: `User already exists with this ${field}` 
      });
    }

    // Find referrer if refer code is provided
    let referredBy = null;
    if (referCode) {
      const referrer = await UserExecutive.findOne({ 
        $or: [
          { mobile: referCode },
          { aadharNumber: referCode },
          { panNumber: referCode }
        ]
      });
      if (referrer) {
        referredBy = referrer._id;
      }
    }

    const newUser = new UserExecutive({
      userType,
      name,
      dateOfBirth: new Date(dateOfBirth),
      relationshipStatus,
      mobile,
      email,
      aadharNumber,
      panNumber,
      pinCode,
      state,
      city,
      address,
      password,
      pointPercentage: pointPercentage || 100,
      referCode,
      dealerCode,
      referredBy,
      createdBy: req.user.userId
    });

    await newUser.save();
    
    // Populate the response
    await newUser.populate('referredBy', 'name mobile');
    await newUser.populate('createdBy', 'firstName lastName');

    res.status(201).json({
      message: 'User created successfully',
      user: newUser
    });
  } catch (error) {
    console.error('Create user error:', error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        message: `User already exists with this ${field}` 
      });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = { ...req.body };
    
    // Add updatedBy field
    updateData.updatedBy = req.user.userId;
    
    // Convert dateOfBirth to Date object if provided
    if (updateData.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateData.dateOfBirth);
    }

    // Check for duplicate mobile, aadhar, or pan (excluding current user)
    if (updateData.mobile || updateData.aadharNumber || updateData.panNumber) {
      const duplicateQuery = {
        _id: { $ne: userId },
        $or: []
      };
      
      if (updateData.mobile) duplicateQuery.$or.push({ mobile: updateData.mobile });
      if (updateData.aadharNumber) duplicateQuery.$or.push({ aadharNumber: updateData.aadharNumber });
      if (updateData.panNumber) duplicateQuery.$or.push({ panNumber: updateData.panNumber });
      
      if (duplicateQuery.$or.length > 0) {
        const existingUser = await UserExecutive.findOne(duplicateQuery);
        if (existingUser) {
          let field = 'mobile';
          if (existingUser.aadharNumber === updateData.aadharNumber) field = 'Aadhar number';
          if (existingUser.panNumber === updateData.panNumber) field = 'PAN number';
          return res.status(400).json({ 
            message: `Another user already exists with this ${field}` 
          });
        }
      }
    }

    const updatedUser = await UserExecutive.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('referredBy', 'name mobile')
    .populate('verifiedBy', 'firstName lastName')
    .populate('createdBy', 'firstName lastName')
    .populate('updatedBy', 'firstName lastName');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        message: `Another user already exists with this ${field}` 
      });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete user
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const user = await UserExecutive.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete associated documents
    if (user.documents && user.documents.length > 0) {
      user.documents.forEach(doc => {
        const filePath = path.join('uploads/documents', doc.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    // Update referrer's count if this user was referred
    if (user.referredBy) {
      await UserExecutive.findByIdAndUpdate(
        user.referredBy,
        { 
          $inc: { totalReferredUsers: -1 },
          $pull: { referredUsers: user._id }
        }
      );
    }

    await UserExecutive.findByIdAndDelete(req.params.id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Verify/Unverify user
router.patch('/:id/verification', auth, adminAuth, async (req, res) => {
  try {
    const { isVerified, reason } = req.body;
    const user = await UserExecutive.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (isVerified) {
      await user.verify(req.user.userId);
    } else {
      await user.unverify(reason || 'No reason provided', req.user.userId);
    }

    await user.populate('verifiedBy', 'firstName lastName');

    res.json({
      message: `User ${isVerified ? 'verified' : 'unverified'} successfully`,
      user
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user points
router.patch('/:id/points', auth, adminAuth, async (req, res) => {
  try {
    const { points, operation = 'add', type = 'earned' } = req.body;
    const user = await UserExecutive.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (operation === 'add') {
      await user.addPoints(points, type);
    } else if (operation === 'deduct') {
      await user.deductPoints(points);
    } else {
      // Set absolute values
      if (type === 'earned') {
        user.totalEarnedPoints = points;
        user.availablePoints = points + user.referPoints;
      } else if (type === 'refer') {
        user.referPoints = points;
        user.availablePoints = user.totalEarnedPoints + points;
      }
      await user.save();
    }

    res.json({
      message: 'Points updated successfully',
      user: {
        totalEarnedPoints: user.totalEarnedPoints,
        availablePoints: user.availablePoints,
        referPoints: user.referPoints,
        redeemAmount: user.redeemAmount
      }
    });
  } catch (error) {
    console.error('Update points error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// Upload documents
router.post('/:id/documents', auth, adminAuth, upload.fields([
  { name: 'aadhar_front', maxCount: 1 },
  { name: 'aadhar_back', maxCount: 1 },
  { name: 'pan_card', maxCount: 1 },
  { name: 'cancelled_check', maxCount: 1 }
]), async (req, res) => {
  try {
    const user = await UserExecutive.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const uploadedDocs = [];

    // Process each uploaded file
    Object.keys(req.files).forEach(fieldName => {
      const file = req.files[fieldName][0];
      const document = {
        type: fieldName,
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url: `/uploads/documents/${file.filename}`
      };

      // Remove existing document of same type
      user.documents = user.documents.filter(doc => doc.type !== fieldName);
      
      // Add new document
      user.documents.push(document);
      uploadedDocs.push(document);
    });

    await user.save();

    res.json({
      message: 'Documents uploaded successfully',
      documents: uploadedDocs
    });
  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete document
router.delete('/:id/documents/:docId', auth, adminAuth, async (req, res) => {
  try {
    const user = await UserExecutive.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const document = user.documents.id(req.params.docId);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Delete file from filesystem
    const filePath = path.join('uploads/documents', document.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove document from user
    user.documents.pull(req.params.docId);
    await user.save();

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user statistics
router.get('/stats/overview', auth, adminAuth, async (req, res) => {
  try {
    const statistics = await UserExecutive.getStatistics();
    
    // Get user type distribution
    const userTypeStats = await UserExecutive.aggregate([
      {
        $group: {
          _id: '$userType',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get monthly registration trend
    const monthlyStats = await UserExecutive.aggregate([
      {
        $match: {
          registrationDate: { 
            $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) 
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$registrationDate' },
            month: { $month: '$registrationDate' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      overview: statistics,
      userTypeDistribution: userTypeStats,
      monthlyTrend: monthlyStats
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Serve uploaded files
router.get('/documents/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join('uploads/documents', filename);
  
  if (fs.existsSync(filePath)) {
    res.sendFile(path.resolve(filePath));
  } else {
    res.status(404).json({ message: 'File not found' });
  }
});

export default router;