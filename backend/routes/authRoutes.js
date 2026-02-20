const express = require('express');
const router = express.Router();
const { loginUser, registerUser, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/login', loginUser);
router.post('/register', registerUser); // Optional/Admin usage
router.post('/check-email', require('../controllers/authController').checkEmail);
router.get('/me', protect, getMe);

module.exports = router;
