const express = require('express');
const router = express.Router();
const authController = require('../controllers/loginController');

// توجيه الطلب فقط
router.post('/login', loginController.login);

module.exports = router;