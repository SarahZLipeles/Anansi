define(["js/game.logic/moves"], function (BuildMoves) {

	function MoveHandler(options){
		var threads = {},
			pendingMoves = [],
			opponent = options.opponent,
			moves = BuildMoves(options);

		var registerThread = (threadid) => {
			threads[threadid] = 0;
		};

		var clearThread = (threadid) => {
			pendingMoves = pendingMoves.map((moveArr) => {
				return moveArr.filter((move) => {
					return move.thread !== threadid;
				});
			});
			threads[threadid] = 0;
		}

		var update = (move, threadid) => {
			//add the move
		}

		var handleMove = (move) => {
			if(move.type === "attack"){
				moves.attack(move);
			}else if(move.type === "reinforce"){
				moves.reinforce(move);
			}
		};

		var makeMoves = () => {
			var nextMoves = pendingMoves.splice(0, 1);
			nextMoves.forEach(handleMove);
			opponent.send({type: "move", moves: nextMoves});
		};

		var tryToMove = () => {
			if(pendingMoves.length > 0){
				makeMoves();
			}else{
				opponent.send({type: "move", moves: []});
			}
		};

		var execute = (data) => {
			if(data.moves.length > 0){
				data.moves.forEach(handleMove);
			}
			if(pendingMoves.length > 0){
				makeMoves();
			}else{
				setTimeout(tryToMove, 20);
			}
		};



		return {
			execute: execute,
			update: update,
			register: registerThread,
			clearThread: clearThread
		};
	}
	return MoveHandler;
});
