const Complaint = require('../models/Complaint.js');

// Get all complaints (for admin)
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ message: 'Failed to fetch complaints' });
  }
};

// Get complaints by student ID (for user dashboard)
const getComplaintsByStudent = async (req, res) => {
  try {
    const { studentId, userId } = req.params;
    const id = userId || studentId; // Use userId if available, otherwise use studentId
    
    const complaints = await Complaint.find({ userId: id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    console.error('Error fetching student complaints:', error);
    res.status(500).json({ message: 'Failed to fetch complaints' });
  }
};

// Create new complaint
const createComplaint = async (req, res) => {
  try {
    const {
      userId,
      userName,
      room,
      title,
      description,
      category,
      priority
    } = req.body;

    const complaint = new Complaint({
      userId,
      userName,
      room,
      title,
      description,
      category,
      priority
    });

    const savedComplaint = await complaint.save();
    res.status(201).json(savedComplaint);
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({ message: 'Failed to create complaint' });
  }
};

// Update complaint status (admin only)
const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const updateData = { status };
    if (status === 'resolved') {
      updateData.resolvedAt = new Date();
    }
    if (adminNotes) {
      updateData.adminNotes = adminNotes;
    }

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json(complaint);
  } catch (error) {
    console.error('Error updating complaint:', error);
    res.status(500).json({ message: 'Failed to update complaint' });
  }
};

// Delete complaint
const deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const complaint = await Complaint.findByIdAndDelete(id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    console.error('Error deleting complaint:', error);
    res.status(500).json({ message: 'Failed to delete complaint' });
  }
};

// Get complaint by ID
const getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;
    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json(complaint);
  } catch (error) {
    console.error('Error fetching complaint:', error);
    res.status(500).json({ message: 'Failed to fetch complaint' });
  }
};

module.exports = {
  getAllComplaints,
  getComplaintsByStudent,
  createComplaint,
  updateComplaintStatus,
  deleteComplaint,
  getComplaintById
}; 