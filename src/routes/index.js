const { Router } = require('express');
const router = Router();

const { 
    createUser,
    loginUser
} = require('../controllers/users');

const { 
    add,
    list
} = require('../controllers/math');

// user routes
router.post('/user/signup', createUser);
router.post('/user/signin', loginUser);

// math routes
router.post('/adding', add);
router.get('/list', list);

module.exports = router;