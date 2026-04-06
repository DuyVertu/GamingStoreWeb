import express from 'express';
import User from '../models/User.js';

const router = express.Router();

function setupGuard(req, res, next) {
  const secret = process.env.SETUP_SECRET;
  if (!secret) {
    return res.status(404).json({ success: false, message: 'Not found' });
  }
  const key = req.headers['x-setup-key'];
  if (!key || key !== secret) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  next();
}

/**
 * POST /api/setup/bootstrap
 * One-time (or idempotent) tạo / cập nhật tài khoản admin-owner đã Verified trên DB cloud.
 * Header: X-Setup-Key: <SETUP_SECRET> (chỉ hoạt động khi biến SETUP_SECRET được set trên server)
 */
router.post('/bootstrap', setupGuard, async (req, res) => {
  try {
    const { email, password, name, role = 'owner' } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu trường: email, password, name',
      });
    }
    const allowed = ['admin', 'owner'];
    const r = allowed.includes(role) ? role : 'owner';

    let user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (user) {
      user.name = name;
      user.password = password;
      user.role = r;
      user.status = 'Verified';
      user.loginAttempts = 0;
      user.lockUntil = undefined;
      user.verificationCode = undefined;
      user.verificationCodeExpires = undefined;
      await user.save();
      return res.json({
        success: true,
        message: 'Đã cập nhật tài khoản (Verified + quyền bán hàng)',
        user: { email: user.email, role: user.role, status: user.status },
      });
    }

    await User.create({
      name,
      email: email.toLowerCase().trim(),
      password,
      role: r,
      status: 'Verified',
    });
    return res.status(201).json({
      success: true,
      message: 'Đã tạo tài khoản admin',
      user: { email: email.toLowerCase().trim(), role: r, status: 'Verified' },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
