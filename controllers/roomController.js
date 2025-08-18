const asyncHandler = require('express-async-handler');
const Room = require('../models/room.js');

// @desc    Fetch all rooms
// @route   GET /api/admin/rooms
// @access  Private/Admin
const getAllRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find({});
  res.json(rooms);
});

// @desc    Add a new room
// @route   POST /api/admin/rooms
// @access  Private/Admin
const addRoom = asyncHandler(async (req, res) => {
  const { roomNumber, roomType, capacity, price, notes } = req.body;

  const roomExists = await Room.findOne({ roomNumber });

  if (roomExists) {
    res.status(400);
    throw new Error('Room number already exists');
  }

  const room = new Room({
    roomNumber,
    roomType,
    capacity,
    price,
    notes
  });

  const createdRoom = await room.save();
  res.status(201).json(createdRoom);
});

// @desc    Update a room
// @route   PUT /api/admin/rooms/:id
// @access  Private/Admin
const updateRoom = asyncHandler(async (req, res) => {
  const { roomNumber, roomType, capacity, price, notes, isAvailable, currentOccupants } = req.body;

  const room = await Room.findById(req.params.id);

  if (room) {
    room.roomNumber = roomNumber || room.roomNumber;
    room.roomType = roomType || room.roomType;
    room.capacity = capacity !== undefined ? capacity : room.capacity;
    room.price = price !== undefined ? price : room.price;
    room.notes = notes !== undefined ? notes : room.notes;
    room.isAvailable = isAvailable !== undefined ? isAvailable : room.isAvailable;
    room.currentOccupants = currentOccupants !== undefined ? currentOccupants : room.currentOccupants;

    const updatedRoom = await room.save();
    res.json(updatedRoom);
  } else {
    res.status(404);
    throw new Error('Room not found');
  }
});

// @desc    Delete a room
// @route   DELETE /api/admin/rooms/:id
// @access  Private/Admin
const deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (room) {
    await room.deleteOne();
    res.json({ message: 'Room removed' });
  } else {
    res.status(404);
    throw new Error('Room not found');
  }
});

module.exports = { getAllRooms, addRoom, updateRoom, deleteRoom };