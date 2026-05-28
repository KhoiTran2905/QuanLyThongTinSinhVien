// src/routes/student/tuitionRoutes.js
const express = require('express');
const router = express.Router();
const tuitionController = require('../../controllers/student/tuitionController');

router.get('/current', tuitionController.getCurrentTuition);
router.get('/history', tuitionController.getTuitionHistory);
router.get('/payment-methods', tuitionController.getPaymentMethods);
router.get('/bank-info', tuitionController.getBankInfo);
router.get('/receipt/:id', tuitionController.getReceipt);
router.post('/pay', tuitionController.processPayment);

module.exports = router;
