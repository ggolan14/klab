const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check} = require('express-validator/check');
const {userAuthenticate, userAuthentication} = require('../../controllers/users');

router.get('/', auth, userAuthentication);

router.post('/', [
    check('email', 'Please include user name').exists(),
    check('password', 'Password is required').exists()
], userAuthenticate);

module.exports = router;
