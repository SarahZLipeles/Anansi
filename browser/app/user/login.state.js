var loginController = require("./login.controller");
'use strict';

var loginState = function ($stateProvider){
    $stateProvider.state('login', {
        url: '/login',
        templateUrl: '/app/user/login.html',
        controller: loginController
    });
};
loginState.$inject = ["$stateProvider"];

module.exports = loginState;

