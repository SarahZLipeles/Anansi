'use strict';
var Promise = require('bluebird');
var path = require('path');

var DATABASE_URI = require(path.join(__dirname, '../env')).DATABASE_URI;

var mongoose = require('mongoose');
var db = mongoose.connect(DATABASE_URI).connection;

// Require our models -- these should register the model into mongoose
// so the rest of the application can simply call mongoose.model('User')
// anywhere the User model needs to be used.
require('./models');

var startDbPromise = new Promise(function (resolve, reject) {
    db.on('open', resolve);
    db.on('error', reject);
});

console.log('Opening connection to MongoDB . . .');
startDbPromise.then(function () {
    console.log('MongoDB connection opened!');
});

module.exports = startDbPromise;