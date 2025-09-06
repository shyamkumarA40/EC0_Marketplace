const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length > 0) return res.status(400).json({ msg: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const newUser = await pool.query(
            "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username",
            [username, email, password_hash]
        );

        const payload = { user: { id: newUser.rows[0].id } };
        jwt.sign(payload, 'your_jwt_secret', { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.status(201).json({ token, user: newUser.rows[0] });
        });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (result.rows.length === 0) return res.status(400).json({ msg: 'Invalid credentials' });

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const payload = { user: { id: user.id } };
        jwt.sign(payload, 'your_jwt_secret', { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
        });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;