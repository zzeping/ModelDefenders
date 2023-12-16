const express = require('express');
const router = express.Router();
const mutantController = require('../controllers/mutantController');
const multer = require('multer');


// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './uploads/mutant');
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
//     },
// });
// const upload = multer({ storage: storage });

const upload = multer(); 

router.post('/', upload.none(), mutantController.createMutant);
router.get('/game/:id', mutantController.getGameMutants);
router.get('/:id', mutantController.getMutant);
router.delete('/:id', mutantController.deleteMutant);


module.exports = router;