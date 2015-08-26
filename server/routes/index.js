var router = require("express").Router();
var path = require("path");

router.use('/', require('./peer.connect.js'));
router.use('/user', require('./user.js'));


module.exports = router;