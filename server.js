const connectDB = require('./config/db');
const express = require('express');
const app = express();
const userRoutes = require('./routes/users');

// Middleware to parse JSON
app.use(express.json());

// Connect Database
connectDB();

// Test root route
app.get('/', (req, res) => {
    res.send("Server Started");
});

// Use user routes
app.use('/api/users', userRoutes); // <- fixed

// Set the Port
const PORT = 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server Started at http://localhost:${PORT}`);
});
