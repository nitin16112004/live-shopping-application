require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const ShoppingRoom = require('../models/ShoppingRoom');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await ShoppingRoom.deleteMany();

    console.log('Cleared existing data');

    // Create users
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });

    const seller1 = await User.create({
      username: 'seller1',
      email: 'seller1@example.com',
      password: 'password123',
      role: 'seller'
    });

    const seller2 = await User.create({
      username: 'seller2',
      email: 'seller2@example.com',
      password: 'password123',
      role: 'seller'
    });

    const user1 = await User.create({
      username: 'user1',
      email: 'user1@example.com',
      password: 'password123',
      role: 'user'
    });

    const user2 = await User.create({
      username: 'user2',
      email: 'user2@example.com',
      password: 'password123',
      role: 'user'
    });

    console.log('Users created');

    // Create products
    const product1 = await Product.create({
      name: 'Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      price: 149.99,
      stock: 50,
      images: ['https://via.placeholder.com/300?text=Headphones'],
      category: 'Electronics',
      seller: seller1._id
    });

    const product2 = await Product.create({
      name: 'Smart Watch',
      description: 'Feature-rich smartwatch with health tracking',
      price: 299.99,
      stock: 30,
      images: ['https://via.placeholder.com/300?text=Smart+Watch'],
      category: 'Electronics',
      seller: seller1._id
    });

    const product3 = await Product.create({
      name: 'Running Shoes',
      description: 'Comfortable running shoes for all terrain',
      price: 89.99,
      stock: 100,
      images: ['https://via.placeholder.com/300?text=Running+Shoes'],
      category: 'Fashion',
      seller: seller2._id
    });

    const product4 = await Product.create({
      name: 'Yoga Mat',
      description: 'Non-slip yoga mat for all fitness levels',
      price: 29.99,
      stock: 75,
      images: ['https://via.placeholder.com/300?text=Yoga+Mat'],
      category: 'Sports',
      seller: seller2._id
    });

    const product5 = await Product.create({
      name: 'Coffee Maker',
      description: 'Programmable coffee maker with timer',
      price: 79.99,
      stock: 40,
      images: ['https://via.placeholder.com/300?text=Coffee+Maker'],
      category: 'Home',
      seller: seller1._id
    });

    console.log('Products created');

    // Create shopping rooms
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    await ShoppingRoom.create({
      title: 'Tech Tuesday - Electronics Sale',
      description: 'Amazing deals on electronics including headphones and smartwatches',
      seller: seller1._id,
      products: [product1._id, product2._id],
      status: 'live',
      scheduledTime: now,
      startedAt: now,
      maxViewers: 100,
      currentViewers: 0
    });

    await ShoppingRoom.create({
      title: 'Fashion & Fitness Friday',
      description: 'Get fit with our running shoes and yoga equipment',
      seller: seller2._id,
      products: [product3._id, product4._id],
      status: 'scheduled',
      scheduledTime: tomorrow,
      maxViewers: 150
    });

    await ShoppingRoom.create({
      title: 'Home Essentials Week',
      description: 'Everything you need for your home',
      seller: seller1._id,
      products: [product5._id],
      status: 'scheduled',
      scheduledTime: nextWeek,
      maxViewers: 100
    });

    console.log('Shopping rooms created');

    console.log('✅ Seed data created successfully!');
    console.log('\nTest Accounts:');
    console.log('Admin: admin@example.com / password123');
    console.log('Seller 1: seller1@example.com / password123');
    console.log('Seller 2: seller2@example.com / password123');
    console.log('User 1: user1@example.com / password123');
    console.log('User 2: user2@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

connectDB().then(() => seedData());
