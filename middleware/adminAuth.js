const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

exports.protectAdmin = async (req, res, next) => {
  console.log('\n=== Admin Auth Middleware ===');
  console.log('Request headers:', req.headers);
  
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    console.log('Token extracted:', token);
  }

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    console.log('Verifying token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded:', decoded);

    const admin = await Admin.findById(decoded.id);
    console.log('Admin found:', admin ? 'Yes' : 'No');

    if (!admin) {
      console.log('Admin not found in database');
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    req.admin = admin;
    console.log('Auth successful, proceeding to next middleware');
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};
