// authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class userController {

  static async register (req, res) {
    try {
      const { username, password} = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        username,
        password: hashedPassword,
      });
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Registration failed' });
    }
  };

  static async login (req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });

      if (!user) {
        return res.status(401).json({ error: 'Authentication failed' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Authentication failed' });
      }

      const token = jwt.sign({ userId: user._id }, 'secret_key', {
        expiresIn: '1h',
      });

      res.status(200).json({ token, userId: user._id });
    } catch (error) {
      res.status(500).json({ error: 'Authentication failed' });
    }
  };

}

module.exports = userController;

