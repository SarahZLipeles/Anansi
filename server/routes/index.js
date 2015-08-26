var router = require("express").Router();
var path = require("path");

router.use('/', require('./peer.connect.js'));
router.use('/login', require('./login.js'));
router.use('/signup', require('./signup.js'));


module.exports = router;