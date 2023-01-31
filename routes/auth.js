//separate out auth from Users
const express = require('express');
const { register, login, getMe } = require('../controllers/auth');

// Middleware
const { protect } = require('../middleware/auth');

//create router
const router = express.Router();

// router.post('/register', register)
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/me').get(protect, getMe);

module.exports = router;
