const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectToDb } = require('./config/db');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

connectToDb().then(() => {
    app.listen(port, () => {
        console.log(`TEKLIY Server is running on port: ${port}`);
    });
});

// Default Route
app.get('/', (req, res) => {
    res.send('ALHAMDULILLAH++ TEKLIY Backend Server is Running...');
});