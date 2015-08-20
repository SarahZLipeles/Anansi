define([], function () {
	var setBases = function (game){
		var bases = game.board.bases;
		var yourBase = bases[game.role];
		var theirBase = bases[game.opponentRole];

		yourBase.owner = game.role;
		yourBase.from = yourBase.id;

		//need to get the bases from nodes not from bases
		//the client doesn't get the reference, they get separate objects


		theirBase.owner = game.opponentRole;
		theirBase.from = theirBase.id;
	};

	return setBases;
});