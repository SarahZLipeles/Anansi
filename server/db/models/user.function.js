'use strict';
var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    startText: {
        type: String,
        require: true
    },
    receiveText: {
        type: String,
        require: true
    }
});

mongoose.model('UserFunction', schema);