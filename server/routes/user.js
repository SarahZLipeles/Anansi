var router = require("express").Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var UserFunction = mongoose.model('UserFunction');
router.get('/', function(req, res, next){
    User.find({})
        .exec()
        .then(function(user){
            res.status(200).json(user)
        })
        .then(null, next)
});

router.post('/', function(req, res, next){
    User.create(req.body)
        .then(function(user){
            if(user){
                res.status(201).json(user);
            }
            else {
                next();
            }
        })
        .then(null, next);
});


module.exports = router;