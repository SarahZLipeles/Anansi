var playController = require("./play.controller");
'use strict'

var playState = function($stateProvider) {
    $stateProvider.state('play', {
        url: '/play',
        templateUrl: '/app/play/play.html',
        controller: playController
    });
};
playState.$inject = ["$stateProvider"];

module.exports = playState;