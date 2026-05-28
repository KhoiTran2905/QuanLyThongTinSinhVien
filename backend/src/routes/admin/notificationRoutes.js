// src/routes/admin/notificationRoutes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../../controllers/admin/notificationController');

router.get('/stats', notificationController.getStats);
router.get('/', notificationController.getAllNotifications);
router.post('/', notificationController.createNotification);
router.put('/:id', notificationController.updateNotification);
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
