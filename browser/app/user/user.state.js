var loginController = require("./login.controller");
'use strict';

var userState = function ($stateProvider){
    $stateProvider.state('user', {
        url: '/user',
        templateUrl: '/app/user/login.html',
        controller: loginController
    });
};
userState.$inject = ["$stateProvider"];

module.exports = userState;

