// authController.js
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class userController {

  // user management 
  static async createUser(req, res) {
    const user = req.body;
    try {
      await User.create(user);
      res.status(201).json({ message: "User created successfully!" })
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  }
  static async updateUser(req, res) {
    const id = req.params.id;
    const newUser = req.body;
    try {
      await User.findByIdAndUpdate(id, newUser);
      res.status(200).json({ message: "User update successfully!" })
    } catch (err) {
      res.status(404).json({ message: err.message })
    }
  }
  static async deleteUser(req, res) {
    const id = req.params.id;
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(401).json({ error: 'User not found.' });;
      }
      await user.destroy();
      res.status(200).json({ message: "User deleted successfully!" })
    } catch (err) {
      res.status(404).json({ message: err.message })
    }
  }
  static async fetchAllUsers(req, res) {
    try {
      const users = await User.findAll();
      res.status(200).json(users);
    } catch (err) {
      res.status(404).json({ message: err.message })
    }
  }

  static async fetchLogin(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res.status(401).json({ error: 'Authentication failed' });
      }
      if (user.password !== password) return res.status(401).json({ error: 'Authentication failed' });
      res.status(200).json(user);
    } catch (err) {
      res.status(404).json({ message: err.message })
    }
  }


  static async register(req, res) {
    try {
      const { username, password } = req.body;
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

  static async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res.status(401).json({ error: 'Authentication failed' });
      }
      // const isPasswordValid = await bcrypt.compare(password, user.password); 
      const isPasswordValid = (user.password == password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Authentication failed' });
      }

      const token = jwt.sign({ userId: user.id }, 'secret_key', {
        expiresIn: '1h',
      });

      res.status(200).json({ token, user });
    } catch (error) {
      res.status(500).json({ error: 'Authentication failed' });
    }
  };


  static async fetchUser(req, res) {
    const id = req.params.id;
    try {
      const user = await User.findOne({ where: { id } });
      res.status(200).json(user);
    } catch (err) {
      res.status(404).json({ message: err.message })
    }
  }

}

module.exports = userController;

