// src/routes/student/notificationRoutes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../../controllers/student/notificationController');

router.get('/unread-count', notificationController.getUnreadCount);
router.put('/read-all', notificationController.markAllAsRead);
router.get('/', notificationController.getNotifications);
router.put('/:id/read', notificationController.markAsRead);
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
