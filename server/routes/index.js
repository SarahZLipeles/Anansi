var router = require("express").Router();
var path = require("path");

router.use('/', require('./peer.connect.js'));


module.exports = router;