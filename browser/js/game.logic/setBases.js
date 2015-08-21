define([], function () {
	var setBases = (game) => {
		var bases = game.board.bases;
		var yourBase = bases[game.role];
		var theirBase = bases[game.opponentRole];
		var yoBase = game.board.nodes.find((node) => {return node.id === yourBase.id; });
		var thBase = game.board.nodes.find((node) => {return node.id === theirBase.id; });

		yourBase.owner = game.role;
		yourBase.from = yourBase.id;
		yoBase.owner = game.role;
		yoBase.from = yoBase.id;

		theirBase.owner = game.opponentRole;
		theirBase.from = theirBase.id;
		thBase.owner = game.opponentRole;
		thBase.from = thBase.id;

	};

	return setBases;
});