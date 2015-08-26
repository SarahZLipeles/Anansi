var playState = require("./play/play.state"),
	navbar = require("./navbar/navbar.directive"),
	game = require("./play/game/game.directive"),
	editor = require("./play/editor/editor.directive"),
	crawler = require("./play/crawler.function/crawler.function.directive"),
	homepageState = require("./homepage/homepage.state"),
	editorState = require("./play/editor/editor.state"),
	userState = require("./user/user.state"),
	userFactory = require("./user/user.factory"),
	normalize = require('normalize-css'),
	fsaPreBuilt = require('./fsa/fsa-pre-built');

"use strict";
var app = angular.module('Anansi', ['ui.router', 'ui.ace', require('angular-animate'), 'fsaPreBuilt']);

app.config(function($urlRouterProvider, $stateProvider, $locationProvider){
	$locationProvider.html5Mode(true);
	$urlRouterProvider
		.when('user', function($state) {
			$state.go('user');
		})
		.otherwise('/');
});

app.config(homepageState);
app.config(playState);
app.config(editorState);
app.config(userState);
app.directive(crawler.name, crawler.func);
app.directive(navbar.name, navbar.func);
app.directive(game.name, game.func);
app.directive(editor.name, editor.func);
app.factory('UserFactory', userFactory);


// This app.run is for controlling access to specific states.
app.run(function($rootScope, AuthService, $state) {

	// The given state requires an authenticated views.
	var destinationStateRequiresAuth = function(state) {
		return state.data && state.data.authenticate;
	};

	// $stateChangeStart is an event fired
	// whenever the process of changing a state begins.
	$rootScope.$on('$stateChangeStart', function(event, toState, toParams) {

		if (!destinationStateRequiresAuth(toState)) {
			// The destination state does not require authentication
			// Short circuit with return.
			return;
		}

		if (AuthService.isAuthenticated()) {
			// The views is authenticated.
			// Short circuit with return.
			return;
		}

		// Cancel navigating to new state.
		event.preventDefault();

		AuthService.getLoggedInUser().then(function(user) {
			// If a views is retrieved, then renavigate to the destination
			// (the second time, AuthService.isAuthenticated() will work)
			// otherwise, if no views is logged in, go to "login" state.
			if (user) {
				$state.go(toState.name, toParams);
			} else {
				$state.go('user');
			}
		});

	});

});
