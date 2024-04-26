const express = require('express');
const router = express.Router();
const mutantController = require('../controllers/mutantController');
const mutant_validation_check = require('../middleware/mutantValidation')
const mutantCheckKill = require('../middleware/mutantCheckKill')

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './uploads/mutant');
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
//     },
// });
// const upload = multer({ storage: storage });


router.post('/',mutant_validation_check, mutantCheckKill, mutantController.createMutant);
router.get('/game/:id', mutantController.getGameMutants);
router.get('/:id', mutantController.getMutant);
router.delete('/:id', mutantController.deleteMutant);
router.delete('/game/:game', mutantController.deleteMutants);
router.patch('/:game',mutantController.resetMutants)


module.exports = router;