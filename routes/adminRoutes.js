const express = require('express');
const router = express.Router();
const { login, getCurrentAdmin } = require('../controllers/adminAuthController');
const { protectAdmin } = require('../middleware/adminAuth');
const User = require('../models/Register');

// Debug middleware
router.use((req, res, next) => {
  console.log('Admin Route accessed:', req.method, req.originalUrl);
  next();
});

// Login route
router.post('/login', login);

// Get current admin route (protected)
router.get('/me', protectAdmin, getCurrentAdmin);

// Get all users
router.get('/users', protectAdmin, async (req, res) => {
  console.log('GET /users route hit');
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Approve user
router.put('/users/:userId/approve', protectAdmin, async (req, res) => {
  console.log('PUT /users/:userId/approve route hit', req.params.userId);
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { status: 'Active' },
      { new: true }
    );
    
    if (!user) {
      console.log('User not found:', req.params.userId);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('User approved successfully:', user._id);
    res.json({ message: 'User approved successfully', user });
  } catch (error) {
    console.error('Error approving user:', error);
    res.status(500).json({ message: 'Failed to approve user' });
  }
});

// Reject user
router.put('/users/:userId/reject', protectAdmin, async (req, res) => {
  console.log('PUT /users/:userId/reject route hit', req.params.userId);
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { status: 'Rejected' },
      { new: true }
    );
    
    if (!user) {
      console.log('User not found:', req.params.userId);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('User rejected successfully:', user._id);
    res.json({ message: 'User rejected successfully', user });
  } catch (error) {
    console.error('Error rejecting user:', error);
    res.status(500).json({ message: 'Failed to reject user' });
  }
});

// Delete user
router.delete('/users/:userId', protectAdmin, async (req, res) => {
  console.log('DELETE /users/:userId route hit', req.params.userId);
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    
    if (!user) {
      console.log('User not found:', req.params.userId);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('User deleted successfully:', req.params.userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

module.exports = router;
