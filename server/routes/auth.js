import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import crypto from 'crypto';
import { sendEmail, generateOTP } from '../utils/email.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    let user = await User.findOne({ email });
    if (user) {
      if (user.status === 'Verified') {
         return res.status(400).json({ success: false, message: 'Email already exists and is verified' });
      }
      // If unverified, we can recreate or just update the OTP
    } else {
      user = new User({ name, email, password, status: 'Unverified' });
    }
    
    const isEmailConfigured = process.env.EMAIL_PASS && process.env.EMAIL_PASS !== 'your-google-app-password';
    const otp = isEmailConfigured ? generateOTP() : '123456';
    user.verificationCode = otp;
    user.verificationCodeExpires = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save();
    
    await sendEmail({
       to: email,
       subject: 'Welcome to GamingGear! Verify your email',
       text: `Hello ${name},\n\nYour OTP code is: ${otp}\n\nThis code will expire in 10 minutes.`
    });
    
    res.status(201).json({
      success: true,
      message: 'Account created. Please check your email for OTP.',
      status: 'Unverified'
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   POST /api/auth/verify-email
router.post('/verify-email', async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ 
       email, 
       verificationCode: code,
       verificationCodeExpires: { $gt: Date.now() } 
    });

    if (!user) {
       return res.status(400).json({ success: false, message: 'Invalid or expired verification code' });
    }

    user.status = 'Verified';
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    const token = generateToken(user._id);
    res.status(200).json({ success: true, message: 'Account verified successfully', token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check account locks
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res.status(403).json({ success: false, message: `Account locked. Try again in ${remainingTime} minutes.` });
    }

    if (user.status === 'Blocked') {
       return res.status(403).json({ success: false, message: 'Account has been blocked by admin.' });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      user.loginAttempts += 1;
      if (user.loginAttempts >= 5) {
         user.lockUntil = Date.now() + 15 * 60 * 1000; // 15 mins lock
         await user.save();
         return res.status(403).json({ success: false, message: 'Too many failed attempts. Account locked for 15 minutes.' });
      }
      await user.save();
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.status === 'Unverified') {
       return res.status(403).json({ success: false, message: 'Account is unverified. Please verify your email first.' });
    }
    
    // Success reset attempts
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();
    
    const token = generateToken(user._id);
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
     const user = await User.findOne({ email: req.body.email });
     if (!user) {
       return res.status(404).json({ success: false, message: 'There is no user with that email' });
     }

     const resetToken = crypto.randomBytes(20).toString('hex');
     user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
     user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 mins
     await user.save({ validateBeforeSave: false });

     // Send email
     await sendEmail({
       to: user.email,
       subject: 'Password reset token',
       text: `You requested a password reset. Your reset token is: ${resetToken}\nMake a request to /api/auth/reset-password with this token.`
     });

     res.status(200).json({ success: true, message: 'Email sent' });
  } catch (error) {
     res.status(500).json({ success: false, message: 'Email could not be sent' });
  }
});

// @route   POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
     const resetPasswordToken = crypto.createHash('sha256').update(req.body.token).digest('hex');
     const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpires: { $gt: Date.now() }
     });

     if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid token' });
     }

     user.password = req.body.password;
     user.resetPasswordToken = undefined;
     user.resetPasswordExpires = undefined;
     await user.save();
     
     const token = generateToken(user._id);
     res.status(200).json({ success: true, token });
  } catch (error) {
     res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, user: req.user });
});

export default router;
