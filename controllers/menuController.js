const Menu = require('../models/menu');

// Get all menu data
exports.getAllMenus = async (req, res) => {
  try {
    console.log('Fetching all menus...');
    const menus = await Menu.find();
    console.log('Found menus:', menus);
    
    const menuData = {};
    
    menus.forEach(menu => {
      menuData[menu.day] = {
        breakfast: menu.menu.breakfast,
        lunch: menu.menu.lunch,
        dinner: menu.menu.dinner
      };
    });

    console.log('Sending menu data:', menuData);
    res.json(menuData);
  } catch (error) {
    console.error('Error in getAllMenus:', error);
    res.status(500).json({ message: 'Error fetching menu data', error: error.message });
  }
};

// Add new menu item
exports.addMenuItem = async (req, res) => {
  try {
    const { day, meal, item } = req.body;

    const menu = await Menu.findOne({ day });
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found for this day' });
    }

    menu.menu[meal].items.push({ name: item });
    await menu.save();

    res.json({ message: 'Item added successfully', menu });
  } catch (error) {
    res.status(500).json({ message: 'Error adding menu item', error: error.message });
  }
};

// Edit menu item
exports.editMenuItem = async (req, res) => {
  try {
    const { day, meal, oldItem, newItem } = req.body;

    const menu = await Menu.findOne({ day });
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found for this day' });
    }

    const itemIndex = menu.menu[meal].items.findIndex(item => item.name === oldItem);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found' });
    }

    menu.menu[meal].items[itemIndex].name = newItem;
    await menu.save();

    res.json({ message: 'Item updated successfully', menu });
  } catch (error) {
    res.status(500).json({ message: 'Error updating menu item', error: error.message });
  }
};

// Delete menu item
exports.deleteMenuItem = async (req, res) => {
  try {
    const { day, meal, item } = req.body;

    const menu = await Menu.findOne({ day });
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found for this day' });
    }

    menu.menu[meal].items = menu.menu[meal].items.filter(menuItem => menuItem.name !== item);
    await menu.save();

    res.json({ message: 'Item deleted successfully', menu });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting menu item', error: error.message });
  }
};

// Edit meal time
exports.editMealTime = async (req, res) => {
  try {
    const { day, meal, time } = req.body;

    const menu = await Menu.findOne({ day });
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found for this day' });
    }

    menu.menu[meal].time = time;
    await menu.save();

    res.json({ message: 'Meal time updated successfully', menu });
  } catch (error) {
    res.status(500).json({ message: 'Error updating meal time', error: error.message });
  }
};

// Delete meal
exports.deleteMeal = async (req, res) => {
  try {
    const { day, meal } = req.body;

    const menu = await Menu.findOne({ day });
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found for this day' });
    }

    menu.menu[meal] = {
      time: '',
      items: []
    };
    await menu.save();

    res.json({ message: 'Meal deleted successfully', menu });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting meal', error: error.message });
  }
};

// Initialize menu for a day
exports.initializeMenu = async (req, res) => {
  try {
    const { day } = req.body;

    const existingMenu = await Menu.findOne({ day });
    if (existingMenu) {
      return res.status(400).json({ message: 'Menu already exists for this day' });
    }

    const newMenu = new Menu({
      day,
      menu: {
        breakfast: {
          time: '7:00 AM - 9:00 AM',
          items: []
        },
        lunch: {
          time: '12:00 PM - 2:00 PM',
          items: []
        },
        dinner: {
          time: '7:00 PM - 9:00 PM',
          items: []
        }
      }
    });

    await newMenu.save();
    res.status(201).json({ message: 'Menu initialized successfully', menu: newMenu });
  } catch (error) {
    res.status(500).json({ message: 'Error initializing menu', error: error.message });
  }
};