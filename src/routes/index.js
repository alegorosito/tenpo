const { Router } = require('express');
const router = Router();

const { 
    createUser,
    loginUser,
    logoutUser
} = require('../controllers/users');

const { 
    add,
    list
} = require('../controllers/math');

// user routes
router.post('/user/signup', createUser);
router.post('/user/signin', loginUser);
router.get('/user/logout', logoutUser);

// math routes
router.post('/adding', add);
router.get('/list', list);

module.exports = router;