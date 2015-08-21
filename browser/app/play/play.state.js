'use strict'

var playState = function ($stateProvider){
	$stateProvider.state('play', {
		url: '/play',
		templateUrl: '/app/play/play.html',
		controller: '/app/play/play.controller.js'
	});
};
playState.$inject = ["$stateProvider"];

module.exports = playState;

