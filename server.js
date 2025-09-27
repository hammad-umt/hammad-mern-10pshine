import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/users.js';
import notesRoutes from './routes/notes.js';
import { swaggerUi, swaggerSpec } from './swagger.js';
import logger from './config/logger.js';

dotenv.config(); // Load env variables

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect Database
connectDB();

// Root
app.get('/', (req, res) => {
  res.redirect('/api-docs');
  logger.info('Root route accessed, redirecting to /api-docs');
});

// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/notes', notesRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Started at http://localhost:${PORT}`);
});
