// src/routes/admin/courseRoutes.js
const express = require('express');
const router = express.Router();
const courseController = require('../../controllers/admin/courseController');

router.get('/stats', courseController.getCourseStats);
router.get('/top-enrolled', courseController.getTopEnrolled);
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.post('/', courseController.createCourse);
router.put('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

module.exports = router;