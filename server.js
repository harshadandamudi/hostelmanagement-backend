const express = require('express');
const path = require('path');
const dotEnv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs'); 
const Razorpay = require('razorpay');
const userRoutes = require('./routes/userRoutes'); // Add this line to import the fs module
const authRoutes = require('./routes/adminRoutes');
const registrationRoutes = require('./routes/registerRoutes');
const menuRoutes = require('./routes/menuRoutes');
const roomRoutes = require('./routes/roomRoutes.js');
const complaintRoutes = require('./routes/complaintRoutes.js');
const paymentRoutes = require('./routes/paymentRoutes');
// Load environment variables
dotEnv.config();

const app = express();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5174', // Your React app's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Apply CORS middleware with options
app.use(cors(corsOptions));

// Parse JSON bodies - MUST be before request logging
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log('\n=== Incoming Request ===');
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));
  console.log('=======================\n');
  next();
});
app.use('/api/admin', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/admin/rooms', roomRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/payment', paymentRoutes);
// Routes
app.use('/', registrationRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 404 handler
app.use((req, res) => {
  console.log('\n=== 404 Not Found ===');
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('=====================\n');
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.log('\n=== Error Occurred ===');
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  console.log('Error:', err);
  console.log('Stack:', err.stack);
  console.log('=====================\n');
  
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`Server Running Successfully at ${PORT}`);
});

