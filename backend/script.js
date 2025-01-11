const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

app.use(cors());
app.use(express.json());

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Update with your MySQL username
    password: 'internshala', // Update with your MySQL password
    database: 'chat_app'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

const SECRET_KEY = 'CHatApp235765IoKnow';
let onlineUsers = [];

app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
        db.query(query, [username, hashedPassword], (err) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).send('Username already exists');
                }
                return res.status(500).send('Error registering user');
            }

            res.status(201).send('User registered successfully');
        });
    } catch (error) {
        res.status(500).send('Error registering user');
    }
});

// Login Route
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).send('Invalid username or password');
        }

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).send('Invalid username or password');
        }

        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ username, token });
    });
});

// Socket.IO Logic
io.on('connection', (socket) => {
    console.log('A user connected');

    // Fetch and send chat history
    const historyQuery = `
        SELECT m.id, m.message, m.timestamp, u.username 
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        ORDER BY m.timestamp ASC LIMIT 100
    `;
    db.query(historyQuery, (err, results) => {
        if (err) {
            console.error('Error fetching chat history:', err);
        } else {
            socket.emit('chatHistory', results);
        }
    });

    socket.on('join', (username) => {
        if (!onlineUsers.includes(username)) {
            onlineUsers.push(username);
        }
        socket.username = username;
        io.emit('userList', onlineUsers);
        socket.broadcast.emit('message', { username: 'System', text: `${username} has joined the chat.` });
    });

    socket.on('disconnect', () => {
        onlineUsers = onlineUsers.filter((user) => user !== socket.username);
        io.emit('userList', onlineUsers);
        socket.broadcast.emit('message', { username: 'System', text: `${socket.username} has left the chat.` });
    });

    // Save message to the database
    socket.on('message', (msg) => {
        const { username, text } = msg;

        // Fetch sender_id from the users table
        const senderQuery = 'SELECT id FROM users WHERE username = ?';
        db.query(senderQuery, [username], (err, results) => {
            if (err || results.length === 0) {
                console.error('Error finding sender user:', err);
                return;
            }

            const senderId = results[0].id;

            const query = 'INSERT INTO messages (sender_id, message) VALUES (?, ?)';
            db.query(query, [senderId, text], (err) => {
                if (err) {
                    console.error('Error saving message:', err);
                } else {
                    io.emit('message', { username, text, timestamp: new Date() }); // Broadcast message to all clients
                }
            });
        });
    });
});

// Start Server
server.listen(5000, () => {
    console.log('Server is running on port 5000');
});
