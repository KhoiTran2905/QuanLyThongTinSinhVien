// src/routes/admin/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/admin/dashboardController');

router.get('/stats', dashboardController.getStats);
router.get('/online-users', dashboardController.getOnlineUsersCount);
router.get('/recent-students', dashboardController.getRecentStudents);
router.get('/events', dashboardController.getEvents);
router.get('/distribution', dashboardController.getDistribution);
router.get('/pending-requests', dashboardController.getPendingRequests);

module.exports = router;
