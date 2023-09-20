const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const multer = require('multer');
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    jwt.verify(token, 'secret_key', (err, decodedToken) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token has expired' });
            } else {
                return res.status(401).json({ message: 'Token is not valid' });
            }
        }
        req.user = decodedToken.userId;
        next();
    });
}

const upload = multer(); // Set up multer middleware to handle multipart/form-data

// user management
router.post('/register', upload.none(), userController.createUser);
router.get('/', authenticateToken, userController.fetchAllUsers);
router.get('/:id', authenticateToken, userController.fetchUser); // only when the token is valid, the frontend can get the user by userId
router.patch('/:id', authenticateToken, upload.none(), userController.updateUser);
router.delete('/:id', authenticateToken, userController.deleteUser);
router.post('/login', upload.none(), userController.login)


module.exports = router;
