define([], function () {
	'use strict'

	var homepageState = function ($stateProvider){
		$stateProvider.state('homepage', {
			url: '/',
			templateUrl: '/app/homepage/homepage.html'
		});
	};
	homepageState.$inject = ["$stateProvider"];
	
	return homepageState;
});