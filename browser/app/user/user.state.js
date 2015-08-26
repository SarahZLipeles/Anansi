var loginController = require("./login.controller");
'use strict';

var userState = function ($stateProvider){
    $stateProvider.state('login', {
        url: '/login',
        templateUrl: '/app/user/login.html',
        controller: loginController
    });
    $stateProvider.state('signup', {
        url: '/signup',
        templateUrl: '/app/user/signup.html',
        controller: loginController
    });
};
userState.$inject = ["$stateProvider"];

module.exports = userState;

