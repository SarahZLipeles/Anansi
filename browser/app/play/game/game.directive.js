var connect = require("../../../game/connect");

var game = {name: "game"};
game.func = function(){
	return {
		restrict: 'E',
		template: '<div id="container"></div>',
		controller: function () {
			connect();
		}
	}
};

module.exports = game;
