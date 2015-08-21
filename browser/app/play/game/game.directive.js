define(["game/connect"], function (connect) {
	var game = {name: "game"};
	game.func = function(){
		return {
			restrict: 'E',
			templateUrl:'/app/play/game/game.html',
			controller: function () {
				connect();
			}
		}
	};
	return game;
})
