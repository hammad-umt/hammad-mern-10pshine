const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send("Server Started");
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server Started at http://localhost:${PORT}`);
});
