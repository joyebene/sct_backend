require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');

// Import models in the correct order
const Bus = require('./models/Bus');
const User = require('./models/User');
const Route = require('./models/Route');
const Booking = require('./models/Booking');

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('MongoDB Connected for Seeding...');

    // Clear existing data
    await Booking.deleteMany({});
    await User.deleteMany({});
    await Route.deleteMany({});
    await Bus.deleteMany({});
    console.log('Previous data cleared!');

    // --- 1. Create Buses ---
    const buses = await Bus.insertMany([
      { name: 'BUS-001', licensePlate: 'SGX1234A', capacity: 40 },
      { name: 'BUS-002', licensePlate: 'SGX5678B', capacity: 40 },
      { name: 'BUS-003', licensePlate: 'SGX9012C', capacity: 35, model: 'Minibus' },
    ]);
    console.log(`${buses.length} buses created.`);

    // --- 2. Create Users (Drivers and Students) ---
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456789', salt);

    const usersToCreate = [
      // Drivers (assigned to buses)
      {
        name: 'Driver Dan',
        matricNumber: 'DRIVER001',
        password: hashedPassword,
        role: 'driver',
        bus: buses[0]._id,
      },
      {
        name: 'Driver Dave',
        matricNumber: 'DRIVER002',
        password: hashedPassword,
        role: 'driver',
        bus: buses[1]._id,
      },
      {
        name: 'Driver Diana',
        matricNumber: 'DRIVER003',
        password: hashedPassword,
        role: 'driver',
        bus: buses[2]._id,
      },
      // Students
      {
        name: 'Student Sam',
        matricNumber: 'SAZUG/1001',
        password: hashedPassword,
        role: 'student',
      },
      {
        name: 'Student Sally',
        matricNumber: 'SAZUG/1002',
        password: hashedPassword,
        role: 'student',
      },
      // Admin
      {
        name: 'Transport Admin',
        matricNumber: 'ADMIN001',
        password: hashedPassword,
        role: 'admin',
      },
    ];
    const users = await User.insertMany(usersToCreate);
    console.log(`${users.length} users created.`);

    // --- 3. Create Routes (linked to buses) ---
    const routes = await Route.insertMany([
      {
        name: 'Campus Loop (Clockwise)',
        schedule: ['08:00', '09:00', '10:00', '11:00', '12:00'],
        bus: buses[0]._id, // Assign BUS-001
      },
      {
        name: 'Campus Loop (Anti-Clockwise)',
        schedule: ['08:30', '09:30', '10:30', '11:30', '12:30'],
        bus: buses[1]._id, // Assign BUS-002
      },
      {
        name: 'Express: Central Hub to Science Park',
        schedule: ['09:15', '11:15', '13:15', '15:15'],
        bus: buses[2]._id, // Assign BUS-003
      },
    ]);
    console.log(`${routes.length} routes created.`);

    console.log('\n--- Seeding Complete! ---');
    console.log(`Buses: ${buses.length}`);
    console.log(`Users: ${users.length}`);
    console.log(`Routes: ${routes.length}`);
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.disconnect();
    console.log('\nMongoDB Disconnected.');
  }
};

seedDatabase();