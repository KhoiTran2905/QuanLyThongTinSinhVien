// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { loginValidation, changePasswordValidation } = require('../validations/authValidation');

// Public routes
router.post('/login', validate(loginValidation), authController.login);
router.post('/refresh-token', authController.refreshToken);

// Protected routes
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getMe);
router.put('/change-password', authenticate, validate(changePasswordValidation), authController.changePassword);
router.post('/force-change-password', authController.forceChangePassword);

module.exports = router;