const db = require('../database/connection');
const jwt = require('jsonwebtoken');
const { secret_token } = require('../env');

function isNumeric(str) {
    
    if (typeof str != "string") return false;   
    return !isNaN(str) && !isNaN(parseFloat(str));

}

const list = async (req, res) => {
    
    const token = req.headers['token'];

    
    // check if token is sended
    if ( token === undefined) return res.status(400).json("Invalid token or missing."); 
    
    try {
        // validate token
        const validtoken = jwt.verify(token, secret_token);
        
        const query = await db.query('SELECT primer_num, segundo_num, users.username FROM suma INNER JOIN users ON users.id = suma.userid;');

        res.status(200).json(query.rows);
    
    } catch (error) {

        console.log(error.message + ' ' + ((error.expiredAt) ? error.expiredAt : ''));
        return res.status(401).json((error.message == 'jwt expired' ? 'Session expired.' : error.message));
        
    }
    
};

const add = async (req, res) => {

    const token = req.headers['token'];

    // check if token is sended
    if ( token === undefined) return res.status(400).json("Invalid token or missing.");  
    
    try {
        
        // validate token
        const validtoken = jwt.verify(token, secret_token);
        const { first, second } = req.body;
        
        if ( !isNumeric(first) || !isNumeric(second) ) return res.status(400).json({ message: "Invalid number/s." })

        const suma = Number(first) + Number(second);
        const querySuma = "INSERT INTO suma(primer_num, segundo_num, userid) VALUES($1, $2, $3);";
        await db.query(querySuma, [first, second, validtoken.id]);

        return res.status(200).json({ message: "The result is " + suma });

    } catch (error) {

        console.log(error.message + ' ' + ((error.expiredAt) ? error.expiredAt : ''));
        return res.status(401).json((error.message == 'jwt expired' ? 'Session expired.' : error.message));

    }

};

module.exports = {
    list,
    add
};