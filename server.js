const connectDB = require('./config/db');
const express = require('express');
const app = express();
const userRoutes = require('./routes/users');
const { swaggerUi, swaggerSpec } = require('./swagger');
const logger = require('./config/logger');
// Middleware to parse JSON
app.use(express.json());

// Connect Database
connectDB();

// Test root route
app.get('/', (req, res) => {
    res.redirect('/api-docs');
    logger.info('Root route accessed, redirecting to /api-docs');
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Use user routes
app.use('/api/users', userRoutes); 
app.use('/api/notes', require('./routes/notes'));

// Set the Port
const PORT = 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server Started at http://localhost:${PORT}`);
});
