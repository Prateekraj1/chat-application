const express = require('express');
const http = require('http');
const cors = require('cors');
const { registerUser, loginUser } = require('./auth');
const { initializeSocket } = require('./socket');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Update with your MySQL username
    password: 'internshala', // Update with your MySQL password
    database: 'chat_app',
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Authentication Routes
app.post('/api/register', (req, res) => registerUser(req, res, db));
app.post('/api/login', (req, res) => loginUser(req, res, db));

// Initialize Socket.IO with db connection
initializeSocket(server, db);

// Start Server
server.listen(5000, () => {
    console.log('Server is running on port 5000');
});
