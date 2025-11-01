import express from "express"
import { body, validationResult } from "express-validator"
const router = express.Router();
import User from "../models/user.js"
import logger from '../config/logger.js'
import bcrypt from 'bcryptjs'
import fetchUser from "../middleware/fetchUser.js"
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

console.log(process.env.JWT_SECRET);
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
 *   get:
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
router.get("/getUser", fetchUser, async (req, res) => {
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
    body("name").optional().trim().isLength({ min: 2, max: 50 }),
    body("email").optional().isEmail().normalizeEmail(),
    body("image").optional().isString(),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { name, email, image } = req.body;
      const userId = req.user.id;

      // Ensure at least one field is provided
      if (!name && !email && !image) {
        return res.status(400).json({ message: "Provide a name or email to update" });
      }

      const user = await User.findById(userId).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });

      if (email) {
        const existing = await User.findOne({ email });
        if (existing && existing._id.toString() !== userId)
          return res.status(400).json({ message: "Email already in use" });
      }

      if (name) user.name = name;
      if (email) user.email = email;
      if (image) user.image = image;

      await user.save();
      res.json({ message: "User details updated successfully", user });
    } catch (err) {
      logger.error(err.message);
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

/**
 * @swagger
 * /users/forgot-password:
 *   post:
 *     summary: Request a password reset link
 *     description: Sends a password reset link to the user's registered email (valid for 15 minutes).
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Password reset link sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset link sent to your email
 *       400:
 *         description: User not found or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Generate a short-lived JWT token (15 minutes)
    const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "15m" });
    const resetLink = `${process.env.CLIENT_URL}/auth/reset-password/${resetToken}`;

    // Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send reset email
    await transporter.sendMail({
      from: `"Support Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>Hi <strong>${user.name}</strong>,</p>
        <p>You requested to reset your password.</p>
        <p>Click the link below to reset your password (valid for 15 minutes):</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
        <p>If you didn’t request this, please ignore this email.</p>
      `,
    });

    logger.info(`Password reset link sent to: ${email}`);
    return res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (err) {
    logger.error(`Forgot password error: ${err.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @swagger
 * /users/reset-password/{token}:
 *   post:
 *     summary: Reset the user's password using the reset token
 *     description: Resets the password for the user associated with the given token.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The JWT reset token sent to the user's email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [newPassword]
 *             properties:
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 example: newsecurepassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password has been reset successfully
 *       400:
 *         description: Invalid or expired token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash new password and save
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    logger.info(`Password reset successfully for user: ${user.email}`);
    return res.status(200).json({ message: "Password has been reset successfully" });
  } catch (err) {
    logger.error(`Reset password error: ${err.message}`);
    if (err.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Reset link expired" });
    }
    return res.status(500).json({ message: "Invalid or expired token" });
  }
});

export default router;


