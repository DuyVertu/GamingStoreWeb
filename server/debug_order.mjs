import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
await mongoose.connect('mongodb://localhost:27017/estore');

const Product = (await import('./models/Product.js')).default;
const User = (await import('./models/User.js')).default;
const Order = (await import('./models/Order.js')).default;

// Get first product
const product = await Product.findOne({});
console.log('Product:', product?.name, 'ID:', product?._id, 'Stock:', product?.stock);

// Get admin user
const admin = await User.findOne({ role: 'admin' });
console.log('Admin:', admin?.email, 'ID:', admin?._id);

if (product && admin) {
  // Simulate checkout order
  const unitPrice = product.salePrice || product.price;
  const orderItems = [{
    product: product._id,
    name: product.name,
    quantity: 1,
    price: unitPrice,
    image: product.image || ''
  }];
  const itemsPrice = unitPrice;
  const shippingPrice = 30000;
  const tax = Math.round(itemsPrice * 0.1);
  const totalPrice = itemsPrice + shippingPrice + tax;

  try {
    const order = new Order({
      user: admin._id,
      orderItems,
      shippingAddress: {
        fullName: 'Test Direct',
        address: '123 Test',
        city: 'HCM',
        phone: '0123456789',
        zipCode: '700000'
      },
      paymentMethod: 'VNPAY',
      itemsPrice,
      shippingPrice,
      totalPrice,
      isPaid: true,
      paidAt: Date.now(),
      status: 'Pending_Confirm'
    });
    await order.save();
    console.log('✅ Order created successfully! ID:', order._id.toString());
    
    // Update stock
    await Product.updateOne({ _id: product._id }, { $inc: { stock: -1 } });
    console.log('✅ Stock updated!');
  } catch(e) {
    console.log('❌ Error:', e.message);
  }
}
process.exit(0);
