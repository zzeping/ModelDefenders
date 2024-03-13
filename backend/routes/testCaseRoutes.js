const express = require('express');
const router = express.Router();
const testCaseController = require('../controllers/testCaseController');
const test_validation_check = require('../validationCheck/testCaseValidation')



router.post('/', test_validation_check, testCaseController.createTestCase);
router.get('/game/:id', testCaseController.getGameTestCases);
router.get('/:id', testCaseController.getTestCase);
router.get('', testCaseController.getAllTC);
router.delete('/:id', testCaseController.deleteTestCase);


module.exports = router;