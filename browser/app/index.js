var playState = require("./play/play.state"),
	navbar = require("./navbar/navbar.directive"),
	game = require("./play/game/game.directive"),
	editor = require("./play/editor/editor.directive"),
	crawler = require("./play/crawler.function/crawler.function.directive"),
	homepageState = require("./homepage/homepage.state"),
	editorState = require("./play/editor/editor.state");

"use strict";
var app = angular.module('Anansi', ['ui.router', 'ui.ace', require('angular-animate')]);

app.config(function($urlRouterProvider, $stateProvider, $locationProvider){
	$locationProvider.html5Mode(true);
	$urlRouterProvider.otherwise('/');
});

app.config(homepageState);
app.config(playState);
app.config(editorState);
app.directive(crawler.name, crawler.func);
app.directive(navbar.name, navbar.func);
app.directive(game.name, game.func);
app.directive(editor.name, editor.func);

