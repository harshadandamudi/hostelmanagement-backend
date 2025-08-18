const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const RegisterSchema = new mongoose.Schema({
    // Basic Information
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    checkInDate: { type: Date, required: true },
    
    // Personal Details
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    profession: { type: String, required: true },
    companyName: { type: String, required: true },
    emergencyContact: { type: String, required: true },
    
    // Additional Information
    idProof: { type: String, required: false },
    profilePicture: { type: String },
    roomPreference: { type: String, required: true },
    specialRequirements: { type: String },
    
    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  
    status: {
      type: String,
      enum: ['Pending', 'Active', 'Rejected'],
      default: 'Pending'
    }
});

// Hash password before saving
RegisterSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password method
RegisterSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Register = mongoose.model('Register', RegisterSchema);
module.exports = Register;