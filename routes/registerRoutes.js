const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/registerController');
const upload = require('../middleware/registerUpload');

router.post('/register', upload, registerUser);

module.exports = router;
