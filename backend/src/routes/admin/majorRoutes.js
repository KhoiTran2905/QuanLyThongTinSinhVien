// src/routes/admin/majorRoutes.js
const express = require('express');
const router = express.Router();
const majorController = require('../../controllers/admin/majorController');

router.get('/', majorController.getAllMajors);
router.post('/', majorController.createMajor);
router.put('/:id', majorController.updateMajor);
router.delete('/:id', majorController.deleteMajor);

module.exports = router;
