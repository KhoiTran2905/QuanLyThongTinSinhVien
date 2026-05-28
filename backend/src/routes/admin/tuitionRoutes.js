// src/routes/admin/tuitionRoutes.js
const express = require('express');
const router = express.Router();
const tuitionController = require('../../controllers/admin/tuitionController');

router.get('/', tuitionController.getAllTuitions);
router.get('/stats', tuitionController.getTuitionStats);
router.put('/:id/status', tuitionController.updateTuitionStatus);

module.exports = router;
