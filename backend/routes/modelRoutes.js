const express = require('express');
const router = express.Router();
const modelController = require('../controllers/modelController');
const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'MXP') {
            cb(null, './uploads/MXP');
        } else if (file.fieldname === 'image') {
            cb(null, './uploads/image');
        } else {
            cb(new Error('Invalid fieldname for file upload'));
        }
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
});
const upload = multer({ storage: storage });

router.post('/', upload.fields([{ name: 'MXP', maxCount: 1 }, { name: 'image', maxCount: 1 }]), modelController.createModel);
router.get('/', modelController.getAllModels);
router.get('/:id', modelController.fetchModel);
router.delete('/:id', modelController.deleteModel);


module.exports = router;