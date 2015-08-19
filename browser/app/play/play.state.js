define([], function () {
	'use strict'

	var playState = function ($stateProvider){
	    $stateProvider.state('play', {
	        url: '/play',
	        templateUrl: '/app/play/play.html'
	    })
	};
	playState.$inject = ["$stateProvider"];
	
	return playState;
});

