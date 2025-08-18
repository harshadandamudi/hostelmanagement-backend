const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Menu = require('../models/menu');

dotenv.config();

// Log the MongoDB URI (without sensitive data)
console.log('MongoDB URI:', process.env.MONGO_URI ? 'URI is set' : 'URI is not set');

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

// Different menu items for each day
const weeklyMenu = {
  monday: {
    breakfast: [
      { name: 'Idli with Sambar' },
      { name: 'Dosa with Chutney' },
      { name: 'Poha' },
      { name: 'Upma' },
      { name: 'Tea/Coffee' }
    ],
    lunch: [
      { name: 'Jeera Rice' },
      { name: 'Dal Makhani' },
      { name: 'Paneer Butter Masala' },
      { name: 'Roti/Naan' },
      { name: 'Raita' }
    ],
    dinner: [
      { name: 'Chapati' },
      { name: 'Mixed Vegetable Curry' },
      { name: 'Dal Fry' },
      { name: 'Steamed Rice' },
      { name: 'Salad' }
    ]
  },
  tuesday: {
    breakfast: [
      { name: 'Aloo Paratha' },
      { name: 'Curd' },
      { name: 'Puri Bhaji' },
      { name: 'Bread Butter' },
      { name: 'Tea/Coffee' }
    ],
    lunch: [
      { name: 'Biryani' },
      { name: 'Raita' },
      { name: 'Chicken Curry' },
      { name: 'Salad' },
      { name: 'Papad' }
    ],
    dinner: [
      { name: 'Chapati' },
      { name: 'Chole' },
      { name: 'Rice' },
      { name: 'Salad' },
      { name: 'Pickle' }
    ]
  },
  wednesday: {
    breakfast: [
      { name: 'Dosa' },
      { name: 'Sambar' },
      { name: 'Chutney' },
      { name: 'Vada' },
      { name: 'Tea/Coffee' }
    ],
    lunch: [
      { name: 'Rice' },
      { name: 'Rajma' },
      { name: 'Roti' },
      { name: 'Salad' },
      { name: 'Curd' }
    ],
    dinner: [
      { name: 'Chapati' },
      { name: 'Paneer Sabzi' },
      { name: 'Dal' },
      { name: 'Rice' },
      { name: 'Salad' }
    ]
  },
  thursday: {
    breakfast: [
      { name: 'Pav Bhaji' },
      { name: 'Samosa' },
      { name: 'Kachori' },
      { name: 'Jalebi' },
      { name: 'Tea/Coffee' }
    ],
    lunch: [
      { name: 'Rice' },
      { name: 'Butter Chicken' },
      { name: 'Naan' },
      { name: 'Raita' },
      { name: 'Salad' }
    ],
    dinner: [
      { name: 'Chapati' },
      { name: 'Mix Veg' },
      { name: 'Dal' },
      { name: 'Rice' },
      { name: 'Salad' }
    ]
  },
  friday: {
    breakfast: [
      { name: 'Sandwich' },
      { name: 'Cornflakes' },
      { name: 'Fruits' },
      { name: 'Bread Jam' },
      { name: 'Tea/Coffee' }
    ],
    lunch: [
      { name: 'Rice' },
      { name: 'Chicken Curry' },
      { name: 'Roti' },
      { name: 'Salad' },
      { name: 'Raita' }
    ],
    dinner: [
      { name: 'Chapati' },
      { name: 'Paneer Butter Masala' },
      { name: 'Dal' },
      { name: 'Rice' },
      { name: 'Salad' }
    ]
  },
  saturday: {
    breakfast: [
      { name: 'Pancakes' },
      { name: 'Honey' },
      { name: 'Fruits' },
      { name: 'Bread Butter' },
      { name: 'Tea/Coffee' }
    ],
    lunch: [
      { name: 'Rice' },
      { name: 'Chicken Curry' },
      { name: 'Roti' },
      { name: 'Salad' },
      { name: 'Raita' }
    ],
    dinner: [
      { name: 'Chapati' },
      { name: 'Mix Veg' },
      { name: 'Dal' },
      { name: 'Rice' },
      { name: 'Salad' }
    ]
  },
  sunday: {
    breakfast: [
      { name: 'Puri Bhaji' },
      { name: 'Halwa' },
      { name: 'Fruits' },
      { name: 'Bread Butter' },
      { name: 'Tea/Coffee' }
    ],
    lunch: [
      { name: 'Rice' },
      { name: 'Butter Chicken' },
      { name: 'Naan' },
      { name: 'Raita' },
      { name: 'Salad' }
    ],
    dinner: [
      { name: 'Chapati' },
      { name: 'Paneer Sabzi' },
      { name: 'Dal' },
      { name: 'Rice' },
      { name: 'Salad' }
    ]
  }
};

async function initializeMenus() {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB successfully');

    // Check if we can access the database
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));

    for (const day of days) {
      try {
        console.log(`\nProcessing ${day}...`);
        const existingMenu = await Menu.findOne({ day });
        
        if (!existingMenu) {
          console.log(`Creating new menu for ${day}`);
          const newMenu = new Menu({
            day,
            menu: {
              breakfast: {
                time: '7:00 AM - 9:00 AM',
                items: weeklyMenu[day].breakfast
              },
              lunch: {
                time: '12:00 PM - 2:00 PM',
                items: weeklyMenu[day].lunch
              },
              dinner: {
                time: '7:00 PM - 9:00 PM',
                items: weeklyMenu[day].dinner
              }
            }
          });

          const savedMenu = await newMenu.save();
          console.log(`Successfully saved menu for ${day}:`, savedMenu);
        } else {
          // Update existing menu with new items
          existingMenu.menu.breakfast.items = weeklyMenu[day].breakfast;
          existingMenu.menu.lunch.items = weeklyMenu[day].lunch;
          existingMenu.menu.dinner.items = weeklyMenu[day].dinner;
          
          const updatedMenu = await existingMenu.save();
          console.log(`Updated menu for ${day}:`, updatedMenu);
        }
      } catch (dayError) {
        console.error(`Error processing ${day}:`, dayError);
      }
    }

    console.log('\nMenu initialization completed');
    process.exit(0);
  } catch (error) {
    console.error('Fatal error:', error);
    if (error.name === 'MongoServerSelectionError') {
      console.error('Could not connect to MongoDB. Please check:');
      console.error('1. MongoDB server is running');
      console.error('2. MONGO_URI in .env file is correct');
      console.error('3. Network connectivity to MongoDB server');
    }
    process.exit(1);
  }
}

initializeMenus();