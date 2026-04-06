import express from 'express';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// @route   PUT /api/users/profile
// @desc    Update user info (phone, addresses, password)
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('+password');
    
    if (req.body.phone) user.phone = req.body.phone;
    if (req.body.addresses) user.addresses = req.body.addresses;
    
    // Update password if provided
    if (req.body.password) {
      if (req.body.oldPassword) {
         const isMatch = await user.comparePassword(req.body.oldPassword);
         if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Current password is incorrect' });
         }
      } else {
         return res.status(400).json({ success: false, message: 'Please provide current password' });
      }
      user.password = req.body.password;
    }

    await user.save();
    user.password = undefined; // Don't return password
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/users
// @desc    Get all users (UC-10 Mgmt)
// @access  Private/Admin
router.get('/', protect, authorize('admin', 'owner'), async (req, res) => {
  try {
    const users = await User.find({});
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/users/:id/block
// @desc    Block or Unblock a user
// @access  Private/Admin
router.put('/:id/block', protect, authorize('admin', 'owner'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    user.status = user.status === 'Blocked' ? 'Verified' : 'Blocked';
    await user.save();
    
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
