require('dotenv').config();
const { Pool } = require('pg');

const connection = {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASS
};

const db = new Pool(connection);

module.exports = db;