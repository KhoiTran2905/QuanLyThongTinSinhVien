// src/routes/admin/reportRoutes.js
const express = require('express');
const router = express.Router();
const reportController = require('../../controllers/admin/reportController');

router.get('/overview', reportController.getOverview);
router.get('/enrollment-trends', reportController.getEnrollmentTrends);
router.get('/academic-ranking', reportController.getAcademicRanking);
router.get('/gpa-by-department', reportController.getGPAByDepartment);
router.get('/graduation-rate', reportController.getGraduationRate);
router.get('/top-departments', reportController.getTopDepartments);
router.get('/gender-distribution', reportController.getGenderDistribution);
router.get('/department-details', reportController.getDepartmentDetails);

module.exports = router;