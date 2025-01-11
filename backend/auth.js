const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'CHatApp235765IoKnow';

const registerUser = async (req, res, db) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
        db.query(query, [username, hashedPassword], async (err) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).send('Username already exists');
                }
                return res.status(500).send('Error registering user');
            }

            const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1d' }); // Token expires in 1 day

            res.json({
                username,
                token,
            });
        });
    } catch (error) {
        res.status(500).send('Error registering user');
    }
};

const loginUser = (req, res, db) => {
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

        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1d' }); // Token expires in 1 day
        res.json({ username, token });
    });
};

module.exports = { registerUser, loginUser };
