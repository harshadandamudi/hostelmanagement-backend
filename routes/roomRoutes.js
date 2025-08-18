const express = require('express');
const router = express.Router();
const { getAllRooms, addRoom, updateRoom, deleteRoom } = require('../controllers/roomController.js');
const { protect, admin } = require('../middleware/authMiddleware.js');

router.route('/')
  .get(protect, admin, getAllRooms)
  .post(protect, admin, addRoom);

router.route('/:id')
  .put(protect, admin, updateRoom)
  .delete(protect, admin, deleteRoom);

module.exports = router;