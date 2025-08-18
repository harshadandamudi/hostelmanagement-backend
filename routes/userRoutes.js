const express = require('express');
const { loginUser, getUserProfile } = require('../controllers/userController');
const { userProtect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', loginUser);
router.get('/profile', userProtect, getUserProfile);

module.exports = router;
