const express = require('express');
const router = express.Router();
const cohortController = require('../../controllers/admin/cohortController');

router.get('/', cohortController.getAllCohorts);
router.get('/:id', cohortController.getCohortById);
router.post('/', cohortController.createCohort);
router.put('/:id', cohortController.updateCohort);
router.delete('/:id', cohortController.deleteCohort);

module.exports = router;
