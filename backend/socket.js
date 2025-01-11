const { Server } = require('socket.io');
let onlineUsers = [];

const initializeSocket = (server, db) => {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket) => {

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
};

module.exports = { initializeSocket };
