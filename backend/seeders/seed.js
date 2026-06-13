const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');

const User = require('../models/User');
const Category = require('../models/Category');
const Supplier = require('../models/Supplier');
const Warehouse = require('../models/Warehouse');
const Product = require('../models/Product');
const Notification = require('../models/Notification');

dotenv.config();

const seed = async () => {
  await connectDB();

  await Promise.all([
    User.deleteMany(),
    Category.deleteMany(),
    Supplier.deleteMany(),
    Warehouse.deleteMany(),
    Product.deleteMany(),
    Notification.deleteMany()
  ]);

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@stockflow.com',
    password: 'Admin123!',
    role: 'admin',
    status: 'active'
  });

  const categories = await Category.insertMany([
    { name: 'Electronics', description: 'Electronic products' },
    { name: 'Office Supplies', description: 'Office and stationery items' },
    { name: 'Packaging', description: 'Packaging materials' }
  ]);

  const suppliers = await Supplier.insertMany([
    { name: 'Global Tech Supplies', email: 'sales@globaltech.com', phone: '+201000000001', address: 'Cairo, Egypt' },
    { name: 'Office Hub', email: 'info@officehub.com', phone: '+201000000002', address: 'Giza, Egypt' }
  ]);

  const warehouses = await Warehouse.insertMany([
    { name: 'Main Warehouse', code: 'WH-001', address: 'Cairo Industrial Zone' },
    { name: 'Secondary Warehouse', code: 'WH-002', address: '6th of October City' }
  ]);

  await Product.insertMany([
    {
      name: 'Wireless Mouse',
      sku: 'P-1001',
      description: 'Ergonomic wireless mouse',
      price: 120,
      quantity: 24,
      minQuantity: 10,
      category: categories[0]._id,
      supplier: suppliers[0]._id,
      warehouse: warehouses[0]._id,
      createdBy: admin._id
    },
    {
      name: 'Notebook A4',
      sku: 'P-2001',
      description: '100 pages notebook',
      price: 18,
      quantity: 9,
      minQuantity: 15,
      category: categories[1]._id,
      supplier: suppliers[1]._id,
      warehouse: warehouses[1]._id,
      createdBy: admin._id
    }
  ]);

  await Notification.create({
    user: admin._id,
    type: 'info',
    message: 'Seed data created successfully'
  });

  console.log('Seed completed');
  process.exit(0);
};

seed().catch((error) => {
  console.error('Seed failed', error);
  process.exit(1);
});
