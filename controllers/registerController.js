const User = require('../models/Register');
const bcrypt = require('bcrypt');

exports.registerUser = async (req, res) => {
  try {
    const {
      firstName, lastName, email, phone,
      password, address, city, state, checkInDate,
      profession, companyName, emergencyContact,
      roomPreference, specialRequirements
    } = req.body;

    const idProof = req.files?.idProof?.[0]?.filename || '';
    const profilePicture = req.files?.profilePicture?.[0]?.filename || '';

    const user = new User({
      firstName, lastName, email, phone,
      password,checkInDate,
      address, city, state,
      profession, companyName, emergencyContact,
      roomPreference, specialRequirements,
      idProof,
      profilePicture
    });
    console.log('Received checkInDate:', checkInDate);
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    console.error(error);
    console.error("Registration error:", error);
    res.status(500).json({ error: 'Server error during registration' });
  }
};
