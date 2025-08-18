const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Room = require('../models/room.js');

dotenv.config();

const sampleRooms = [
  {
    roomNumber: '101',
    roomType: 'single',
    capacity: 1,
    currentOccupants: 0,
    isAvailable: true,
    price: 5000,
    notes: 'Corner room with good ventilation'
  },
  {
    roomNumber: '102',
    roomType: 'double',
    capacity: 2,
    currentOccupants: 1,
    isAvailable: true,
    price: 8000,
    notes: 'Facing garden'
  },
  {
    roomNumber: '103',
    roomType: 'triple',
    capacity: 3,
    currentOccupants: 3,
    isAvailable: false,
    price: 12000,
    notes: 'Recently renovated'
  },
  {
    roomNumber: '201',
    roomType: 'single',
    capacity: 1,
    currentOccupants: 0,
    isAvailable: true,
    price: 5500,
    notes: 'Premium single room'
  },
  {
    roomNumber: '202',
    roomType: 'double',
    capacity: 2,
    currentOccupants: 2,
    isAvailable: false,
    price: 8500,
    notes: 'Facing pool'
  },
  {
    roomNumber: '203',
    roomType: 'triple',
    capacity: 3,
    currentOccupants: 2,
    isAvailable: true,
    price: 11500,
    notes: 'Spacious room'
  }
];

const initializeRooms = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Clear existing rooms
    await Room.deleteMany({});
    console.log('Cleared existing rooms');

    // Insert sample rooms
    const createdRooms = await Room.insertMany(sampleRooms);
    console.log('Sample rooms created:', createdRooms.length);

    // Log the created rooms
    console.log('Created rooms:');
    createdRooms.forEach(room => {
      console.log(`Room ${room.roomNumber}: ${room.roomType} - ₹${room.price}/month`);
    });

    console.log('Room initialization completed successfully');
  } catch (error) {
    console.error('Error initializing rooms:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the initialization
initializeRooms();