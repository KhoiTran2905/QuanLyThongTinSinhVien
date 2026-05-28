// src/routes/student/gradeRoutes.js
const express = require('express');
const router = express.Router();
const gradeController = require('../../controllers/student/gradeController');

router.get('/gpa-scale', gradeController.getGPAScale);
router.get('/all', gradeController.getAllGrades);
router.get('/semester/:semesterCode', gradeController.getGradesBySemester);
router.get('/', gradeController.getGradeOverview);

module.exports = router;
