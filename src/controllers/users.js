const bcrypt = require('bcrypt');
const db = require('../database/connection');
const jwt = require('jsonwebtoken');
const { secret_token } = require('../env');

function userValidate(user) {

    // User validation
    const validUser = typeof user == 'string' && user.trim() != ''
                        && user.trim().length >= 6 && user.trim().length <=50;

    return validUser;
}

function passwordValidate(pass) {

    // Password validation
    const validPassword = typeof pass == 'string' && pass.trim() != ''
                        && pass.trim().length >= 6 && pass.trim().length <=50;

    return validPassword;
}

const createUser = async (req, res) => {

    try {
        
        const { username, password } = req.body;
        
        // check if username exists
        const users = await db.query('SELECT id FROM users where username = $1;', [username]);
        if (users.rows.length > 0) {
            return res.status(400).json({ message: "User already used."})
        }

        if ( userValidate(username) && passwordValidate(password) ) {

            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            // Store the password
            const query = 'INSERT INTO users(username, password) VALUES($1, $2)';
            const values = [ username, hashedPassword ];
            const response = await db.query(query, values);
    
            return res.status(200).json({ message: "User created succesfully"});

        } else {

            // Ivalid user
            if (!userValidate(username)) return res.status(400).json({ message: "Invalid user. User must be between 6 and 50 characters."}) 

            // Ivalid password
            if (!passwordValidate(password)) return res.status(400).json({ message: "Invalid password. User must be between 6 and 50 characters."}) 

        }

    } catch (error) {
        console.log(error);
    }

};

const loginUser = async (req, res) => {

    try {
        
        const { username, password } = req.body;
        
        // check if username exists
        const users = await db.query('SELECT * FROM users where username = $1;', [username]);
        
        if (users.rows.length > 0) {

            // Validate user password
            const user = users.rows[0];
            const validPassword = await bcrypt.compare(password, user.password);

            // Invalid password
            if (!validPassword) return res.status(400).json({message: "Invalid password."});

            // Create a token for user session
            // that expires in 15 mins.
            const userToken = { id: user.id }
            const token = jwt.sign(userToken, secret_token, { expiresIn: '15m' });

            const values = [user.id, token];

            // Update user token in the DB
            const response = await db.query('UPDATE users SET token = $2 where id = $1;', values);
            
            return res.header('auth-token', token).json({ user: user.username, token: token })           

        } else {

            return res.status(400).json({ message: "Login failed."});
            
        }
        
    } catch (error) {
        console.log(error);
    }

};

module.exports = {
    createUser,
    loginUser
};