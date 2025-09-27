import express from 'express'
import { body, validationResult, param } from 'express-validator'
const router = express.Router();
import Note from '../models/notes.js'
import fetchUser from "../middleware/fetchUser.js"
import logger from '../config/logger.js'

// Swagger Tags
/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: CRUD operations for user notes
 */

// ✅ Common validation error handler
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

/**
 * @swagger
 * /notes/fetchallnotes:
 *   get:
 *     summary: Get all notes of the logged-in user
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of all notes
 *       401:
 *         description: Unauthorized / invalid token
 */
router.get(
  '/fetchallnotes',
  fetchUser,
  async (req, res) => {
    try {
      const notes = await Note.find({ user: req.user.id }).lean();
      res.json(notes);
    } catch (error) {
      logger.error(`Error fetching notes: ${error.message}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * @swagger
 * /notes/addnote:
 *   post:
 *     summary: Add a new note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               tag:
 *                 type: string
 *     responses:
 *       201:
 *         description: Note created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized / invalid token
 */
router.post(
  '/addnote',
  fetchUser,
  [
    body('title')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Title is required (1–100 chars)'),
    body('description')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Description is required'),
    body('tag')
      .optional()
      .trim()
      .isLength({ max: 30 })
      .withMessage('Tag must be ≤ 30 chars'),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const newNote = new Note({
        user: req.user.id,
        title,
        description,
        tag,
      });
      const savedNote = await newNote.save();
      logger.info(`Note added for user: ${req.user.id}`);
      res.status(201).json(savedNote);
    } catch (error) {
      logger.error(`Error adding note: ${error.message}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * @swagger
 * /notes/updatenote/{id}:
 *   put:
 *     summary: Update an existing note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Note ID (MongoDB ObjectId)
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               tag:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated note object
 *       400:
 *         description: Validation error or invalid ID
 *       403:
 *         description: Not allowed (not owner)
 *       404:
 *         description: Note not found
 *       401:
 *         description: Unauthorized / invalid token
 */
router.put(
  '/updatenote/:id',
  fetchUser,
  [
    param('id').isMongoId().withMessage('Invalid note ID'),
    body('title').optional().trim().isLength({ max: 100 }),
    body('description').optional().trim().isLength({ min: 1 }),
    body('tag').optional().trim().isLength({ max: 30 }),
  ],
  handleValidationErrors,
  async (req, res) => {
    const { title, description, tag } = req.body;
    try {
      const newNote = {};
      if (title) newNote.title = title;
      if (description) newNote.description = description;
      if (tag) newNote.tag = tag;

      let note = await Note.findById(req.params.id);
      if (!note) {
        logger.warn(`Note not found: ${req.params.id}`);
        return res.status(404).json({ message: 'Note not found' });
      }

      if (note.user.toString() !== req.user.id) {
        logger.warn(`Unauthorized update attempt by user: ${req.user.id}`);
        return res.status(403).json({ message: 'Not allowed' });
      }

      note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
      logger.info(`Note updated: ${req.params.id} by user: ${req.user.id}`);
      res.json(note);
    } catch (error) {
      logger.error(`Error updating note: ${error.message}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * @swagger
 * /notes/deletenote/{id}:
 *   delete:
 *     summary: Delete a note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Note ID (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Note deleted successfully
 *       400:
 *         description: Validation error or invalid ID
 *       403:
 *         description: Not allowed (not owner)
 *       404:
 *         description: Note not found
 *       401:
 *         description: Unauthorized / invalid token
 */
router.delete(
  '/deletenote/:id',
  fetchUser,
  [param('id').isMongoId().withMessage('Invalid note ID')],
  handleValidationErrors,
  async (req, res) => {
    try {
      let note = await Note.findById(req.params.id);
      if (!note) {
        logger.warn(`Note not found: ${req.params.id}`);
        return res.status(404).json({ message: 'Note not found' });
      }

      if (note.user.toString() !== req.user.id) {
        logger.warn(`Unauthorized delete attempt by user: ${req.user.id}`);
        return res.status(403).json({ message: 'Not allowed' });
      }

      await Note.findByIdAndDelete(req.params.id);
      logger.info(`Note deleted: ${req.params.id} by user: ${req.user.id}`);
      res.json({ message: 'Note deleted successfully', note });
    } catch (error) {
      logger.error(`Error deleting note: ${error.message}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
