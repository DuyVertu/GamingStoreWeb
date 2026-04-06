import express from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { protect, authorize } from '../middleware/auth.js';
import { sendEmail } from '../utils/email.js';

const router = express.Router();

router.use(protect);

// @route   POST /api/orders/checkout
// @desc    Create new order from frontend cart items (no MongoDB cart sync needed)
router.post('/checkout', async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, cartItems } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in cart' });
    }

    // Prepare order items and check stock
    let orderItems = [];
    let itemsPrice = 0;

    for (let item of cartItems) {
      const itemId = item._id || item.id;
      
      // Validate ObjectId format
      if (!itemId || !mongoose.Types.ObjectId.isValid(itemId)) {
        return res.status(400).json({ success: false, message: `ID sản phẩm không hợp lệ: ${itemId}` });
      }
      
      const product = await Product.findById(itemId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Không tìm thấy sản phẩm: ${item.name}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Sản phẩm "${product.name}" không đủ hàng (còn ${product.stock})` });
      }

      const unitPrice = item.salePrice || item.price;
      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: unitPrice,
        image: product.image
      });
      itemsPrice += unitPrice * item.quantity;

      // Update inventory — use updateOne to bypass category enum validation
      await Product.updateOne({ _id: product._id }, { $inc: { stock: -item.quantity } });
    }

    const shippingPrice = shippingAddress?.shippingMethod === 'express' ? 80000 : (itemsPrice > 500000 ? 0 : 30000);
    const tax = Math.round(itemsPrice * 0.1);
    const totalPrice = itemsPrice + shippingPrice + tax;

    const isPaid = ['VNPAY', 'Card', 'MoMo'].includes(paymentMethod);

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      isPaid,
      paidAt: isPaid ? Date.now() : undefined,
      status: 'Pending_Confirm'
    });

    await order.save();

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/orders/pay
// @desc    Create new order from MongoDB Cart (UC-06)
router.post('/pay', async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in cart' });
    }

    // Prepare order items and check stock
    let orderItems = [];
    for (let item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Product ${item.product.name} is out of stock` });
      }
      orderItems.push({
        product: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
        image: item.product.image
      });
      
      // Update inventory (decrease stock)
      item.product.stock -= item.quantity;
      await item.product.save();
    }

    const itemsPrice = cart.totalAmount;
    const shippingPrice = itemsPrice > 1000 ? 0 : 50;
    const totalPrice = itemsPrice + shippingPrice;

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      isPaid: paymentMethod === 'Card' ? true : false,
      paidAt: paymentMethod === 'Card' ? Date.now() : undefined,
      status: 'Pending_Confirm'
    });

    await order.save();

    // Empty the cart
    cart.items = [];
    await cart.save();

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/orders/mine
// @desc    Get logged in user orders (UC-07)
router.get('/mine', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/orders/:id/cancel
// @desc    Cancel order (UC-07)
router.post('/:id/cancel', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString()) return res.status(401).json({ success: false, message: 'Not authorized' });

    if (order.status !== 'Pending_Confirm') {
       return res.status(400).json({ success: false, message: 'You can only cancel pending orders' });
    }

    order.status = 'Cancelled';
    await order.save();
    
    // restore stock
    for (let item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/orders/:id/return
// @desc    Request return product for an order (UC-07)
router.post('/:id/return', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString()) return res.status(401).json({ success: false, message: 'Not authorized' });

    if (order.status !== 'Delivered') {
       return res.status(400).json({ success: false, message: 'You can only return delivered orders' });
    }
    
    // Validate return 7 days
    const diffTime = Math.abs(new Date() - order.deliveredAt);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    if (diffDays > 7) {
       return res.status(400).json({ success: false, message: 'Return period of 7 days has expired' });
    }

    // We can also have a 'Return_Requested' status, but spec says 'Returned' can be processed
    order.status = 'Returned'; 
    await order.save();

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Routes --------

// @route   GET /api/orders
// @desc    Get all orders (UC-11)
// @access  Private/Admin
router.get('/', authorize('admin', 'owner'), async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status and confirm (UC-11)
// @access  Private/Admin
router.put('/:id/status', authorize('admin', 'owner'), async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    // Send Mail on Confirmation logic
    if (order.status === 'Pending_Confirm' && status === 'Shipping') {
       await sendEmail({
          to: order.user.email,
          subject: `GamingGear - Order ${order._id} Confirmed!`,
          text: `Hi ${order.user.name},\nWe have confirmed your order and it is now Shipping!`
       });
    }

    if (status === 'Delivered') {
       order.deliveredAt = Date.now();
       if (!order.isPaid) {
          order.isPaid = true;
          order.paidAt = Date.now();
       }
    }
    
    order.status = status;
    await order.save();

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
