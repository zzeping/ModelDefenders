const express = require('express');
const router = express.Router();
const testCaseController = require('../controllers/testCaseController');




router.post('/', testCaseController.createTestCase);
router.get('/game/:id', testCaseController.getGameTestCases);
router.get('/:id', testCaseController.getTestCase);
router.delete('/:id', testCaseController.deleteTestCase);


module.exports = router;