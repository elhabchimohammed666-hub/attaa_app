const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Item = require('./models/Item');

const sampleUsers = [
  {
    name: 'Ahmed Benali',
    phone: '+212612345678',
    email: 'ahmed@example.com',
    password: 'password123',
    city: 'Casablanca',
    neighborhood: 'Maarif',
  },
  {
    name: 'Fatima Zahra',
    phone: '+212698765432',
    email: 'fatima@example.com',
    password: 'password123',
    city: 'Rabat',
    neighborhood: 'Agdal',
  },
  {
    name: 'Omar Mansouri',
    phone: '+212655443322',
    email: 'omar@example.com',
    password: 'password123',
    city: 'Marrakech',
    neighborhood: 'Gueliz',
  },
];

const sampleItems = [
  {
    title: 'Solid Wood Dining Table with 4 Chairs',
    category: 'Home & Furniture',
    condition: 'Good',
    city: 'Casablanca',
    neighborhood: 'Maarif',
    description:
      'We are moving to a smaller apartment and would love this solid oak dining table to go to a family that needs it. Comes with 4 matching cushioned chairs. Sturdy and clean.',
    images: [
      'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'Available',
    allowWhatsApp: true,
  },
  {
    title: 'Samsung Front-Load Washing Machine (7kg)',
    category: 'Appliances',
    condition: 'Excellent',
    city: 'Rabat',
    neighborhood: 'Agdal',
    description:
      'In excellent working condition. Thoroughly cleaned and sanitized. Giving away Fi Sabilillah to any family in need of a reliable washing machine. Pickup required.',
    images: [
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'Available',
    allowWhatsApp: true,
  },
  {
    title: 'Children Story Books & School Encyclopedia Set',
    category: 'Books',
    condition: 'New',
    city: 'Marrakech',
    neighborhood: 'Gueliz',
    description:
      'A collection of 15 Arabic and French children books and illustrated science encyclopedias. Perfect for elementary school children.',
    images: [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'Available',
    allowWhatsApp: true,
  },
  {
    title: 'Winter Warm Coats & Sweaters (Men L/XL)',
    category: 'Clothing',
    condition: 'Good',
    city: 'Casablanca',
    neighborhood: 'Ain Diab',
    description:
      'Bundle of 3 warm winter jackets and 4 wool sweaters. Clean, washed, and ready to wear for the cold season.',
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'Available',
    allowWhatsApp: true,
  },
  {
    title: 'Wooden Crib / Baby Cot with Clean Mattress',
    category: 'Kids & Toys',
    condition: 'Excellent',
    city: 'Rabat',
    neighborhood: 'Hay Riad',
    description:
      'Our toddler has grown out of this cot. Comes with an adjustable height frame and a spotless sanitized mattress.',
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'Reserved',
    allowWhatsApp: true,
  },
  {
    title: 'HP 24-inch Desktop LED Monitor',
    category: 'Electronics',
    condition: 'Good',
    city: 'Casablanca',
    neighborhood: 'Sidi Maarouf',
    description:
      'Works completely fine with HDMI and VGA ports. Great for a student studying from home or doing school homework.',
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'Donated',
    allowWhatsApp: true,
  },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/attaa_db');
    console.log('🌱 Connected to MongoDB for seeding...');

    await User.deleteMany();
    await Item.deleteMany();

    const createdUsers = await User.create(sampleUsers);
    console.log(`👤 Created ${createdUsers.length} seed users.`);

    const itemsWithUsers = sampleItems.map((item, idx) => {
      const user = createdUsers[idx % createdUsers.length];
      return {
        ...item,
        user: user._id,
        contactPhone: user.phone,
      };
    });

    await Item.create(itemsWithUsers);
    console.log(`📦 Created ${itemsWithUsers.length} sample donation items.`);

    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();
