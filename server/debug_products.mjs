import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
await mongoose.connect('mongodb://localhost:27017/estore');
const Product = (await import('./models/Product.js')).default;
const products = await Product.find({}, 'name category image stock _id').limit(5);
console.log(JSON.stringify(products, null, 2));
// Test save
const p = products[0];
if (p) {
  console.log('\nTesting save on:', p.name, 'stock:', p.stock, 'category:', p.category);
  try {
    const orig = p.stock;
    p.stock = p.stock; // no-op
    await p.save();
    console.log('Save OK!');
  } catch(e) {
    console.log('Save ERROR:', e.message);
  }
}
process.exit(0);
