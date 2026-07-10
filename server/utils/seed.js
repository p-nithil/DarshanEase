const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const dns = require('dns');

// Configure node to use Google DNS for Atlas SRV resolution
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  console.warn('DNS override failed:', e.message);
}

const User = require('../models/User');
const Temple = require('../models/Temple');
const DarshanSlot = require('../models/DarshanSlot');
const Booking = require('../models/Booking');

dotenv.config();

const templesData = [
  {
    name: 'Kedarnath Temple',
    location: 'Rudraprayag District',
    state: 'Uttarakhand',
    description: 'Situated at an altitude of 3,583m near the Mandakini river, Kedarnath is one of the most sacred Shiva temples in the world and part of the holy Chhota Char Dham pilgrimage. Encircled by snow-capped peaks, it offers a deeply mystical and tranquil atmosphere for devotees.',
    images: [
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596701062351-df1ff690f214?q=80&w=800&auto=format&fit=crop'
    ],
    timings: '6:00 AM - 7:00 PM',
    darshanTypes: [
      {
        name: 'General Darshan',
        price: 0,
        description: 'Standard queue for all devotees. Access to the main sabha mandap.'
      },
      {
        name: 'VIP Darshan',
        price: 1100,
        description: 'Priority queue access, direct entry to the inner sanctum, and prasad bag.'
      },
      {
        name: 'Maha Abhishek Puja',
        price: 2500,
        description: 'Special early morning Abhishek puja (4:00 AM - 6:00 AM) with specialized chanting, angavastram, and premium prasad.'
      }
    ],
    isActive: true
  },
  {
    name: 'Meenakshi Amman Temple',
    location: 'Madurai City',
    state: 'Tamil Nadu',
    description: 'A historic Hindu temple located on the southern bank of the Vaigai River in Madurai. It is dedicated to Goddess Meenakshi, a form of Shakti, and her consort, Sundareswarar. The temple is a masterpiece of Dravidian architecture with 14 majestic gopurams.',
    images: [
      'https://images.unsplash.com/photo-1600100397608-f010e42ecb86?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1608958416710-bb974bf30064?q=80&w=800&auto=format&fit=crop'
    ],
    timings: '5:00 AM - 10:00 PM',
    darshanTypes: [
      {
        name: 'General Darshan',
        price: 0,
        description: 'General queue entry. Expected wait time 1-2 hours.'
      },
      {
        name: 'Special Entry Darshan',
        price: 100,
        description: 'Express queue with reduced waiting time and quick walk-through.'
      },
      {
        name: 'VIP Quick Darshan',
        price: 250,
        description: 'Priority pathway to the sanctum, dedicated guide support, and special laddu prasad.'
      }
    ],
    isActive: true
  },
  {
    name: 'Tirupati Balaji Temple',
    location: 'Tirumala Hills',
    state: 'Andhra Pradesh',
    description: 'Sri Venkateswara Temple is a landmark Vaishnavite temple situated in the hill town of Tirumala. Dedicated to Lord Venkateswara, an incarnation of Vishnu, it is famously known as the Temple of Seven Hills and is one of the most visited holy shrines in the world.',
    images: [
      'https://images.unsplash.com/photo-1544085311-11a028465b03?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?q=80&w=800&auto=format&fit=crop'
    ],
    timings: '3:00 AM - 11:30 PM',
    darshanTypes: [
      {
        name: 'Sarvadarsanam (Free)',
        price: 0,
        description: 'Free darshan for all devotees. Wait times vary depending on seasonal rush.'
      },
      {
        name: 'Special Entry Darshan (Sheeghra Darshan)',
        price: 300,
        description: 'Quick entry slot booked in advance. Includes 2 delicious Tirupati laddus.'
      },
      {
        name: 'Kalyanotsavam Seva',
        price: 1000,
        description: 'Participate in the celestial marriage ritual of the Lord. Includes high-quality vastram and premium prasad.'
      }
    ],
    isActive: true
  }
];

const timeSlots = [
  '06:00 AM - 09:00 AM',
  '09:00 AM - 12:00 PM',
  '03:00 PM - 06:00 PM',
  '06:00 PM - 09:00 PM'
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/darshanease');
    console.log('Database connected for seeding...');

    // Drop collections to clear legacy indexes
    const collectionsToDrop = ['users', 'temples', 'darshanslots', 'bookings'];
    for (const coll of collectionsToDrop) {
      try {
        await mongoose.connection.db.dropCollection(coll);
        console.log(`Collection '${coll}' dropped successfully.`);
      } catch (err) {
        console.log(`Collection '${coll}' did not exist or could not be dropped: ${err.message}`);
      }
    }

    // Seed Users
    const salt = await bcrypt.genSalt(10);
    const hashedAdminPassword = await bcrypt.hash('admin123', salt);
    const hashedUserPassword = await bcrypt.hash('user123', salt);

    const admin = await User.create({
      name: 'DarshanEase Admin',
      email: 'admin@darshanease.com',
      phone: '9876543210',
      password: 'admin123', // hooks will re-hash if saved through Mongoose create
      role: 'admin'
    });

    const user = await User.create({
      name: 'Rohan Sharma',
      email: 'user@darshanease.com',
      phone: '9123456789',
      password: 'user123', // hooks will re-hash
      role: 'user'
    });

    console.log('Admin and User seeded.');

    // Seed Temples
    const createdTemples = await Temple.create(templesData);
    console.log(`${createdTemples.length} Temples seeded.`);

    // Seed Slots for the next 7 days starting today
    let slotsCreated = 0;
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      currentDate.setUTCHours(0, 0, 0, 0);

      for (const temple of createdTemples) {
        for (const darshan of temple.darshanTypes) {
          for (const slotTime of timeSlots) {
            // General slots have higher capacity than VIP/Seva slots
            let capacity = 100;
            if (darshan.name.includes('VIP') || darshan.name.includes('Maha') || darshan.name.includes('Kalyanotsavam')) {
              capacity = 30;
            } else if (darshan.name.includes('Special')) {
              capacity = 60;
            }

            await DarshanSlot.create({
              templeId: temple._id,
              date: currentDate,
              darshanType: darshan.name,
              timeSlot: slotTime,
              totalCapacity: capacity,
              availableSeats: capacity,
              bookedSeats: 0
            });
            slotsCreated++;
          }
        }
      }
    }

    console.log(`${slotsCreated} Darshan Slots generated for the next 7 days.`);
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
