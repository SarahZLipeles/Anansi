'use strict'

var homepageState = function ($stateProvider){
	$stateProvider.state('homepage', {
		url: '/',
		templateUrl: '/app/homepage/homepage.html',
		controller: function() {$('.mgNavigator').remove();}
	});
};
homepageState.$inject = ["$stateProvider"];

module.exports = homepageState;
