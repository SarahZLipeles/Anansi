var setBases = (game) => {
	var bases = game.board.bases;
	var yourBaseid = bases[game.role];
	var theirBaseid = bases[game.opponentRole];
	var yourBase = game.board.nodes.find((node) => {return node.id === yourBaseid; });
	var their = game.board.nodes.find((node) => {return node.id === theirBaseid; });

	yourBase.owner = game.role;
	yourBase.from = yourBase.id;

	their.owner = game.opponentRole;
	their.from = their.id;

};

module.exports = setBases;
