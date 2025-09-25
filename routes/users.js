const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const User = require("../models/user");
const logger = require('../config/logger');
const bcrypt = require('bcryptjs');
const fetchUser = require("../middleware/fetchUser");
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;  
// Swagger Tags
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User authentication and profile management
 */

// Common validation error handler
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error or user already exists
 */
router.post(
  "/signup",
  [
    body("name").trim().isLength({ min: 2, max: 50 }).withMessage("Name must be 2–50 chars"),
    body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 chars"),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { name, email, password } = req.body;

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
      const authToken = jwt.sign(data, JWT_SECRET, { expiresIn: "1h" });

      logger.info(`User signed up: ${email}`);
      res.status(201).json({ message: "User added successfully!", authToken });
    } catch (err) {
      logger.error(`Signup error: ${err.message}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       400:
 *         description: Invalid credentials or validation error
 */
router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password required (min 6 chars)"),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const loginUser = await User.findOne({ email });
      if (!loginUser) {
        logger.warn(`Login failed: Invalid credentials (${email})`);
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, loginUser.password);
      if (!isMatch) {
        logger.warn(`Login failed: Invalid credentials (${email})`);
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const data = { user: { id: loginUser.id } };
      const authToken = jwt.sign(data, JWT_SECRET, { expiresIn: "1h" });

      logger.info(`User logged in: ${email}`);
      res.json({ message: `Hello, ${loginUser.name}`, authToken });
    } catch (err) {
      logger.error(`Login error: ${err.message}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

/**
 * @swagger
 * /users/getUser:
 *   post:
 *     summary: Get the currently logged-in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns user details (without password)
 *       401:
 *         description: Unauthorized / invalid token
 */
router.post("/getUser", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    logger.error(`Get user error: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @swagger
 * /users/updateDetails:
 *   put:
 *     summary: Update name or email of the logged-in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User details updated successfully
 *       400:
 *         description: Validation error or email already in use
 *       401:
 *         description: Unauthorized / invalid token
 */
router.put(
  "/updateDetails",
  fetchUser,
  [
    body("name").optional().trim().isLength({ min: 2, max: 50 }).withMessage("Name 2–50 chars"),
    body("email").optional().isEmail().normalizeEmail().withMessage("Valid email required"),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { name, email } = req.body;
      const userId = req.user.id;

      if (!name && !email) {
        return res.status(400).json({ message: "Provide a name or email to update" });
      }

      if (email) {
        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser._id.toString() !== userId) {
          return res.status(400).json({ message: "Email already in use" });
        }
      }

      const user = await User.findById(userId).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });

      if (name) user.name = name;
      if (email) user.email = email;

      await user.save();
      logger.info(`User details updated: ${userId}`);
      res.json({ message: "User details updated successfully", user });
    } catch (err) {
      logger.error(`Update details error: ${err.message}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

/**
 * @swagger
 * /users/changePassword:
 *   put:
 *     summary: Change the logged-in user’s password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [oldPassword, newPassword]
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid current password or validation error
 *       401:
 *         description: Unauthorized / invalid token
 */
router.put(
  "/changePassword",
  fetchUser,
  [
    body("oldPassword").isLength({ min: 6 }).withMessage("Old password required"),
    body("newPassword").isLength({ min: 6 }).withMessage("New password must be at least 6 chars"),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const userId = req.user.id;

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid current password" });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);

      await user.save();
      logger.info(`Password changed: ${userId}`);
      res.json({ message: "Password updated successfully" });
    } catch (err) {
      logger.error(`Change password error: ${err.message}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
