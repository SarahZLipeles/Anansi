'use strict'

var homepageState = function ($stateProvider){
	$stateProvider.state('homepage', {
		url: '/',
		templateUrl: '/app/homepage/homepage.html',
		controller: function() {$('.boardNav').remove();}
	});
};
homepageState.$inject = ["$stateProvider"];

module.exports = homepageState;
