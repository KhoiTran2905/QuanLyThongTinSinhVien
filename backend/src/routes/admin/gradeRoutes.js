// src/routes/admin/gradeRoutes.js
const express = require('express');
const router = express.Router();
const gradeController = require('../../controllers/admin/gradeController');

router.get('/stats', gradeController.getGradeStats);
router.get('/distribution', gradeController.getGradeDistribution);
router.get('/gpa-trends', gradeController.getGPATrends);
router.put('/approve-all', gradeController.approveAll);
router.get('/', gradeController.getAllGrades);
router.get('/:id', gradeController.getGradeById);
router.post('/', gradeController.createGrade);
router.put('/:id', gradeController.updateGrade);
router.put('/:id/approve', gradeController.approveGrade);
router.put('/:id/reject', gradeController.rejectGrade);

module.exports = router;