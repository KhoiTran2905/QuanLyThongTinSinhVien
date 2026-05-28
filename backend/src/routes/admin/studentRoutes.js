// src/routes/admin/studentRoutes.js
const express = require('express');
const router = express.Router();
const studentController = require('../../controllers/admin/studentController');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/import', upload.single('file'), studentController.importStudents);
router.get('/', studentController.getAllStudents);
router.get('/:id', studentController.getStudentById);
router.post('/', studentController.createStudent);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

module.exports = router;