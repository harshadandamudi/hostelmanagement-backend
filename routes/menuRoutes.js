const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// Get all menus
router.get('/', menuController.getAllMenus);

// Menu item routes
router.post('/item',   menuController.addMenuItem);
router.put('/item',   menuController.editMenuItem);
router.delete('/item',  menuController.deleteMenuItem);

// Meal routes
router.put('/meal',   menuController.editMealTime);
router.delete('/meal',   menuController.deleteMeal);

// Initialize menu for a day
router.post('/initialize',  menuController.initializeMenu);

module.exports = router;