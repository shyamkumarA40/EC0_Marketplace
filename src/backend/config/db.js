// src/backend/config/db.js
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ecofinds',
    password: 'db123', // <-- IMPORTANT: Replace this!
    port: 5432,
});

module.exports = pool;