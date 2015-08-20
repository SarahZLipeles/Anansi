define([], function () {

	function MoveMachine(options){
		var queue = options.queue,
			nodes = options.nodes,
			opponent = options.opponent,
			pendingMoves = [];

		var handleMove = (move) => {
			if(move.type === "attack"){
				attack(move);
			}else if(move.type === "reinforce"){
				reinforce(move);
			}
		};

		var tryMove = () => {
			if(pendingMoves.length > 0){
				opponent.send({type: "move", moves: pendingMoves.splice(0, 1)});
			}else{
				opponent.send({type: "move", moves: []});
			}
		};

		var update = (data) => {
			if(data.moves.length > 0){
				data.moves.forEach(handleMove);
			}
			if(pendingMoves.length > 0){
				opponent.send({type: "move", moves: pendingMoves.splice(0, 1)});
			}else{
				setTimeout(tryMove, 20);
			}
		};



		return {
			update: update,
			addMove: addMove
		};
	}
	return MoveMachine;
});
