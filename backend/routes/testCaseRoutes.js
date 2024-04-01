const express = require('express');
const router = express.Router();
const testCaseController = require('../controllers/testCaseController');
const test_validation_check = require('../middleware/testCaseValidation')
const tsKillMutants = require('../middleware/tsKillMutants')



router.post('/', test_validation_check, tsKillMutants, testCaseController.createTestCase);
router.get('/game/:id', testCaseController.getGameTestCases);
router.get('/:id', testCaseController.getTestCase);
router.get('', testCaseController.getAllTC);
router.delete('/:game/:id', testCaseController.deleteTestCase);


module.exports = router;