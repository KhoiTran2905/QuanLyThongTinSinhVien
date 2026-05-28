// src/routes/student/scheduleRoutes.js
const express = require('express');
const router = express.Router();
const scheduleController = require('../../controllers/student/scheduleController');

router.get('/stats', scheduleController.getScheduleStats);
router.get('/week/:year/:weekNum', scheduleController.getScheduleByWeek);
router.get('/', scheduleController.getSchedule);

module.exports = router;