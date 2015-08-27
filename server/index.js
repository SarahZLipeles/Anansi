"use strict";
var express = require("express");
var app = express();
var server = require("http").createServer(app);
var logger = require("morgan");
var startDb = require('./db');

var options = {
    debug: process.env.NODE_ENV !== "production"
};


app.set("port", process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3000);
app.set("ip", process.env.OPENSHIFT_NODEJS_IP || "192.168.1.74");


app.use(logger("dev"));

require('./configure')(app);

var peerServer = require("./peerServer")(server, options);

// Routes that will be accessed via AJAX should be prepended with
// /api so they are isolated from our GET /* wildcard.

app.use('/api', peerServer);
app.use('/', require('./routes'));

app.get('/*', function (req, res) {
    res.sendFile(app.get('indexHTMLPath'));
});

app.use(function (req, res, next) {

    if (path.extname(req.path).length > 0) {
        res.status(404).end();
    } else {
        next(null);
    }

});


// Error catching endware.
app.use(function (err, req, res, next) {
    console.error(err, typeof next);
    res.status(err.status || 500).send(err.message || 'Internal server error.');
});

var startServer = function(){
    server.listen(app.get("port"), function () {
        console.log("Server running at %s:%d", app.get("ip"), app.get("port"));
    });
}
startDb.then(startServer).catch(function (err) {
    console.error('Initialization error:', chalk.red(err.message));
    console.error('Process terminating . . .');
    process.kill(1);
});