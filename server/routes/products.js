import express from 'express';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import Order from '../models/Order.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products with filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, brand, minPrice, maxPrice, search, sale, isNew } = req.query;
    
    let query = {};
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Filter by brand
    if (brand) {
      query.brand = brand;
    }
    
    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    // Filter by search
    if (search) {
      query.$text = { $search: search };
    }
    
    // Filter by sale
    if (sale === 'true') {
      query.salePrice = { $exists: true, $ne: null };
    }
    
    // Filter by new
    if (isNew === 'true') {
      query.isNew = true;
    }
    
    const products = await Product.find(query).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/products
// @desc    Create new product (Admin only)
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const product = await Product.create(req.body);
    
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product (Admin only)
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product (Admin only)
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Product deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/products/:id/reviews
// @desc    Create new review
// @access  Private
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    // Check if user bought and order is Delivered
    const orders = await Order.find({ user: req.user._id, status: 'Delivered' });
    const hasBought = orders.some(order => order.orderItems.find(item => item.product.toString() === req.params.id));
    
    if (!hasBought) {
      return res.status(400).json({ success: false, message: 'You can only review products you have bought' });
    }

    const alreadyReviewed = await Review.findOne({ user: req.user._id, product: req.params.id });
    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'Product already reviewed' });
    }

    const review = await Review.create({
      user: req.user._id,
      product: req.params.id,
      rating: Number(rating),
      comment
    });

    // Update product rating
    const reviews = await Review.find({ product: req.params.id });
    const product = await Product.findById(req.params.id);
    product.reviewCount = reviews.length;
    product.rating = reviews.reduce((acc, current) => acc + current.rating, 0) / reviews.length;
    await product.save();

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
