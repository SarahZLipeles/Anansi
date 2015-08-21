define(["app/play/play.controller"], function (playController) {
	'use strict'

	var playState = function ($stateProvider){
		$stateProvider.state('play', {
			url: '/play',
			templateUrl: '/app/play/play.html',
			controller: playController
		});
	};
	playState.$inject = ["$stateProvider"];
	
	return playState;
});

