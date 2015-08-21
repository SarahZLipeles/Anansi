define(["app/play/play.state",
	"app/navbar/navbar.directive",
	"app/play/game/game.directive",
	"app/play/editor/editor.directive",
	"app/homepage/homepage.state"], 
function (playState, navbar, game, editor, homepageState){
	"use strict";
	var app = angular.module('Anansi', ['ui.router']);

	app.config(function($urlRouterProvider, $locationProvider){
		$locationProvider.html5Mode(true);
		$urlRouterProvider.otherwise('/');
	});

	app.config(homepageState);
	app.config(playState);
	app.directive(navbar.name, navbar.func);
	app.directive(game.name, game.func);
	app.directive(editor.name, editor.func);
});


