const express = require('express');
const {
  getAllComplaints,
  getComplaintsByStudent,
  createComplaint,
  updateComplaintStatus,
  deleteComplaint,
  getComplaintById
} = require('../controllers/complaintController.js');

const router = express.Router();

// Get all complaints (admin)
router.get('/', getAllComplaints);

// Get complaints by user ID (user)
router.get('/user/:userId', getComplaintsByStudent);

// Get complaints by student ID (user) - keeping for backward compatibility
router.get('/student/:studentId', getComplaintsByStudent);

// Get specific complaint
router.get('/:id', getComplaintById);

// Create new complaint
router.post('/', createComplaint);

// Update complaint status (admin)
router.put('/:id/status', updateComplaintStatus);

// Delete complaint
router.delete('/:id', deleteComplaint);

module.exports = router; 