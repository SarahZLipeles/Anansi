var router = require("express").Router();
// var mongoose = require('mongoose');
// var User = mongoose.model('User');
// var UserFunction = mongoose.model('UserFunction');

//router.param('email', function(req, res, next , email){
//    User.findOne({'email':req.params.email})
//        .exec()
//        .then(function(user){
//            if (!user) throw Error('Not Found');
//            else {
//                req.user = user
//            }
//        })
//        .then(null, next)
//});

// router.get('/', function(req, res, next){
//     User.findOne({'email':req.params.email})
//         .exec()
//         .then(function(user){
//             if (!user) throw Error('Not Found');
//             else {
//                 res.json(user);
//             }
//         })
//         .then(null, next)
// });

// router.post('/', function(req, res, next){
//     User.findOne({$and: [{'email': req.params.email},{'password': req.params.password}]})
//         .exec()
//         .then(function(user){
//             if(!user) throw Error('Not Found');
//             else {
//                 res.json(user);
//             }
//         })
//         .then(null, next)
// });


module.exports = router;