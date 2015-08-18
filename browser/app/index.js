"use strict";

var app = angular.module('SpiderWars', ['ui.router']);

app.config(function($urlRouterProvider, $locationProvider){
    $locationProvider.html5Mode(true);
    $urlRouterProvider
        .when('editor', function($state) {
            $state.go('editor');
        })
        .otherwise('/');
});

