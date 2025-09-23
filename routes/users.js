const express = require("express");
const router = express.Router();
const User = require("../models/user");
const logger = require('../config/logger');
const bcrypt = require('bcryptjs');
const fetchUser = require("../middleware/fetchUser");
const jwt = require('jsonwebtoken');
// Secret for hashing and salting
const JWT_SECRET = 'thisIsMyNotesAppbYH@mm@$';
// Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      logger.warn(`SignUp Failed: Missing Fields`);
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn(`Signup failed: User already exists (${email})`);
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const securedPass = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: securedPass });
    await newUser.save();

    const data = { user: { id: newUser.id } };
    const authToken = jwt.sign(data, JWT_SECRET, { expiresIn: '1h' });

    logger.info(`User signed up: ${email}`);
    res.json({ message: "User Added successfully!", authToken });
  } catch (err) {
    logger.error(`Signup error: ${err.message}`);
    res.status(500).json({ message: `An error occurred: ${err.message}` });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      logger.warn(`Login Failed : Missing Fields`);
      return res.status(400).json({ message: "All fields are required" });
    }

    const loginUser = await User.findOne({ email });
    if (!loginUser) {
      logger.warn(`Login failed: Invalid credentials (${email})`);
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, loginUser.password);
    if (!isMatch) {
      logger.warn(`Login failed: Invalid credentials (${email})`);
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const data = { user: { id: loginUser.id } };
    const authToken = jwt.sign(data, JWT_SECRET, { expiresIn: '1h' });

    logger.info(`User logged in: ${email}`);
    res.json({ message: `Hello, ${loginUser.name}`, authToken });
  } catch (err) {
    logger.error(`Login error: ${err.message}`);
    res.status(500).json({ message: "Unknown error occurred" });
  }
});

// Get User Route
router.post('/getUser', fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
