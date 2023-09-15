const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const multer = require('multer');


router.post('/register', userController.register);
router.post('/login', userController.login);

const upload = multer(); // Set up multer middleware to handle multipart/form-data

// user management
router.post('/', upload.none(), userController.createUser);
router.get('/', userController.fetchAllUsers);
router.patch('/:id', upload.none(),userController.updateUser);
router.delete('/:id',userController.deleteUser);


module.exports = router;
