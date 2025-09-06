const express = require('express');
const cors = require('cors');
const pool = require('./config/db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

pool.query('SELECT NOW()', (err, res) => {
    if (err) console.error('🔴 DB Connection Error:', err.stack);
    else console.log('🟢 Successfully connected to PostgreSQL.');
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));