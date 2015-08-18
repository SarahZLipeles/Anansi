"use strict";

var app = angular.module('SpiderWars', ['ui.router']);

app.config(function($urlRouterProvider, $locationProvider){
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
});

