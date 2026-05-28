// src/routes/student/registrationRoutes.js
const express = require('express');
const router = express.Router();
const registrationController = require('../../controllers/student/registrationController');

router.get('/info', registrationController.getRegistrationInfo);
router.get('/available', registrationController.getAvailableCourses);
router.get('/registered', registrationController.getRegisteredCourses);
router.post('/register', registrationController.registerCourse);
router.post('/confirm', registrationController.confirmRegistration);
router.delete('/:courseId', registrationController.cancelRegistration);

module.exports = router;