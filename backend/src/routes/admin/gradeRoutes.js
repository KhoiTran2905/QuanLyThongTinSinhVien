// src/routes/admin/gradeRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const gradeController = require('../../controllers/admin/gradeController');

router.post('/import', upload.single('file'), gradeController.importGrades);
router.get('/stats', gradeController.getGradeStats);
router.get('/distribution', gradeController.getGradeDistribution);
router.get('/gpa-trends', gradeController.getGPATrends);
router.get('/options/form-data', gradeController.getGradeFormOptions);
router.put('/approve-all', gradeController.approveAll);
router.get('/', gradeController.getAllGrades);
router.get('/:id', gradeController.getGradeById);
router.post('/', gradeController.createGrade);
router.put('/:id', gradeController.updateGrade);
router.put('/:id/approve', gradeController.approveGrade);
router.put('/:id/reject', gradeController.rejectGrade);
router.delete('/:id', gradeController.deleteGrade);

module.exports = router;