var connect = require("../../../game/connect");

var gameController = function ($scope) {
	var close = connect();
	$scope.$on("$destroy", close);
}

gameController.$inject = ["$scope"];


var game = {name: "game"};
game.func = function(){
	return {
		restrict: 'E',
		templateUrl: '/app/play/game/game.html',
		controller: gameController
	};
};


module.exports = game;
