import express from 'express';
import Order from '../models/Order.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/reports/sales
// @desc    Get sales analytics grouped by month (UC-12)
// @access  Private/Admin
router.get('/sales', protect, authorize('admin', 'owner'), async (req, res) => {
  try {
    const salesData = await Order.aggregate([
      {
         $match: {
           status: { $in: ['Delivered', 'Paid'] } // count revenue from successful orders
         }
      },
      {
         $group: {
           _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
           totalRevenue: { $sum: '$totalPrice' },
           totalOrders: { $sum: 1 }
         }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Also get Top selling products
    const bestSelling = await Order.aggregate([
      { $match: { status: { $in: ['Delivered', 'Paid'] } } },
      { $unwind: '$orderItems' },
      {
         $group: {
           _id: '$orderItems.product',
           name: { $first: '$orderItems.name' },
           totalQuantitySold: { $sum: '$orderItems.quantity' },
           totalRevenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } }
         }
      },
      { $sort: { totalQuantitySold: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        salesData,
        bestSelling
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
