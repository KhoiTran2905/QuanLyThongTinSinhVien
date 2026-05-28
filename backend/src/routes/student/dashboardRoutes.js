// src/routes/student/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/student/dashboardController');

router.get('/', dashboardController.getDashboard);
router.get('/today', dashboardController.getTodaySchedule);
router.get('/notifications', dashboardController.getDashboardNotifications);
router.get('/recent-grades', dashboardController.getRecentGrades);
router.get('/stats', dashboardController.getDashboardStats);

module.exports = router;