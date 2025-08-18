const Register = require('../models/Register');
const jwt = require('jsonwebtoken');

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Register.findOne({ email });
    if (!user) {
      console.warn(`Login failed: User not found for email ${email}`);
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.status !== 'Active') {
      console.warn(`Login failed: User not approved for email ${email}`);
      return res.status(403).json({ message: 'User not approved by admin' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.warn(`Login failed: Invalid credentials for email ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get full user profile (all fields except password)
const getUserProfile = async (req, res) => {
  try {
    const user = await Register.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { loginUser, getUserProfile };
