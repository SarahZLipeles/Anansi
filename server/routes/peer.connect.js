var router = require("express").Router();
var path = require("path");

//Route that serves up the main page
router.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "../layout.html"));
});

router.get("/env", function (req, res) {
    res.json({env: process.env.NODE_ENV});
});

var ids = [];
router.get("/meet/:id", function (req, res) {
    var id = req.params.id;
    var message = {};
    if(ids.length){
        var placeInLine = ids.indexOf(id);
        if(placeInLine !== 0){
            if(placeInLine !== -1){
                ids.splice(placeInLine, 1);
            }
            message.meet = ids.shift();
        }else{
            message.meet = "hold";
        }
    }else{
        ids.push(id);
        message.meet = "hold";
    }
    res.json(message);
});



module.exports = router;