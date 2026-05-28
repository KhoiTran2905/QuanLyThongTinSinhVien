// src/routes/admin/scheduleRoutes.js
const express = require('express');
const router = express.Router();
const scheduleController = require('../../controllers/admin/scheduleController');

router.get('/stats', scheduleController.getScheduleStats);
router.get('/week/:year/:weekNum', scheduleController.getScheduleByWeek);
router.get('/', scheduleController.getSchedules);
router.post('/', scheduleController.createSchedule);
router.put('/:id', scheduleController.updateSchedule);
router.delete('/:id', scheduleController.deleteSchedule);

module.exports = router;