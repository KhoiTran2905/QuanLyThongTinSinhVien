// src/routes/admin/classRoutes.js
const express = require('express');
const router = express.Router();
const classController = require('../../controllers/admin/classController');

router.get('/stats', classController.getClassStats);
router.get('/', classController.getAllClasses);
router.get('/:id', classController.getClassById);
router.get('/:id/students', classController.getClassStudents);
router.post('/', classController.createClass);
router.put('/:id', classController.updateClass);
router.delete('/:id', classController.deleteClass);

module.exports = router;