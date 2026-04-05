import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All cart routes require authentication
router.use(protect);

// @route   GET /api/cart
// @desc    Get current user's cart
router.get('/', async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price image stock');
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [], totalAmount: 0 });
    }
    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/cart/add
// @desc    Add item to cart
router.post('/add', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    
    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: 'Not enough stock available' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const price = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;

    const itemIndex = cart.items.findIndex(p => p.product.toString() === productId);
    if (itemIndex > -1) {
      // Product exists, update qty
      let newQty = cart.items[itemIndex].quantity + quantity;
      if (product.stock < newQty) return res.status(400).json({ success: false, message: 'Not enough stock available' });
      cart.items[itemIndex].quantity = newQty;
      cart.items[itemIndex].price = price;
    } else {
      // New product
      cart.items.push({ product: productId, quantity, price });
    }

    await cart.save();
    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/cart/update/:itemId
// @desc    Update quantity in cart
router.put('/update/:itemId', async (req, res) => {
  try {
    const { quantity } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(p => p.product.toString() === req.params.itemId);
    if (itemIndex > -1) {
      const product = await Product.findById(req.params.itemId);
      if (product.stock < quantity) return res.status(400).json({ success: false, message: 'Not enough stock available' });
      
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      return res.json({ success: true, data: cart });
    }
    
    res.status(404).json({ success: false, message: 'Item not in cart' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/cart/remove/:itemId
// @desc    Remove an item from the cart
router.delete('/remove/:itemId', async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    cart.items = cart.items.filter(p => p.product.toString() !== req.params.itemId);
    await cart.save();
    
    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
