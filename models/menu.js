const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  }
});

const mealSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true
  },
  items: [menuItemSchema]
});

const dayMenuSchema = new mongoose.Schema({
  breakfast: mealSchema,
  lunch: mealSchema,
  dinner: mealSchema
});

const menuSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  },
  menu: dayMenuSchema
}, {
  timestamps: true
});

module.exports = mongoose.model('Menu', menuSchema);