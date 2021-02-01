require('dotenv').config();
const express = require('express');
const db = require('./database/connection');
const app = express();

// middleware
app.use(express.json());

// routes
app.use(require('./routes/index'))

app.listen(3000, () => {
    // Check if tables exists
    migration();
});

const migration = async () => {
    
    console.log("Running migrations.");

    try {

        const tables = "CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, username varchar(50), password varchar(255), token varchar(255)); CREATE TABLE IF NOT EXISTS suma(id SERIAL PRIMARY KEY, primer_num decimal, segundo_num decimal, userid integer);";
    
        const res = await db.query(tables);
    
    } catch (error) {
        console.log(error);
    }

    console.log("Server running on port 3000.")
    
};

