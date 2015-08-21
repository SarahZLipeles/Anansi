var playState = require("./play/play.state"),
	navbar = require("./navbar/navbar.directive"),
	game = require("./play/game/game.directive"),
	editor = require("./play/editor/editor.directive"),
	crawler = require("./play/crawler.function/crawler.function.directive"),
	homepageState = require("./homepage/homepage.state");

"use strict";
var app = angular.module('Anansi', ['ui.router']);

app.config(function($urlRouterProvider, $locationProvider){
$locationProvider.html5Mode(true);
$urlRouterProvider.otherwise('/');
});

app.config(homepageState);
app.config(playState);
app.directive(crawler.name, crawler.func);
app.directive(navbar.name, navbar.func);
app.directive(game.name, game.func);
app.directive(editor.name, editor.func);

