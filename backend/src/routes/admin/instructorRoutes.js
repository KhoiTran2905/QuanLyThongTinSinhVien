// src/routes/admin/instructorRoutes.js
const express = require('express');
const router = express.Router();
const instructorController = require('../../controllers/admin/instructorController');

router.get('/stats', instructorController.getInstructorStats);
router.get('/top-rated', instructorController.getTopRated);
router.get('/', instructorController.getAllInstructors);
router.get('/:id', instructorController.getInstructorById);
router.post('/', instructorController.createInstructor);
router.put('/:id', instructorController.updateInstructor);
router.delete('/:id', instructorController.deleteInstructor);

module.exports = router;