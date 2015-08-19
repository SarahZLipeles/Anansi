define([], function () {
	var setBases = function (game, data){
		var bases = game.board.bases;
		var yourBase = bases[game.role];
		var theirBase = bases[game.opponentRole];

		yourBase.owner = game.role;
		yourBase.from = yourBase.id;

		theirBase.owner = game.opponentRole;
		theirBase.from = theirBase.id;

	};

	return setBases;
});