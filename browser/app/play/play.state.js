
'use strict'

var playState = function ($stateProvider, playController){
	$stateProvider.state('play', {
		url: '/play',
		templateUrl: '/app/play/play.html',
		controller: playController
	});
};
playState.$inject = ["$stateProvider"];

module.exports = playState;

