var BuildMoves = require("./moves");

function MoveHandler(options){
	var threads = {},
		pendingMoves = [],
		{opponent} = options,
		moves = BuildMoves(options);

	var registerThread = (thread) => {
		threads[thread.id] = {moveIndex: 0, thread: thread};
	};

	var clearThread = (threadid) => {
		pendingMoves = pendingMoves.map((moveArr) => {
			return moveArr.filter((move) => {
				return move.thread !== threadid;
			});
		});
		threads[threadid].moveIndex = 0;
	}

	var update = (move) => {
		var threadEntry = threads[move.thread];
		var moveSlot = pendingMoves[threadEntry.moveIndex]
		if(moveSlot){
			moveSlot.push(move);
		}else{
			pendingMoves[threadEntry.moveIndex] = [move];
		}
		threadEntry.moveIndex++;
	}

	var handleUserMove = (move) => {
		var threadEntry = threads[move.thread];
		var thread = threadEntry.thread;
		if(move.type === "attack"){
			thread.currentCrawler.receive.call(thread.userScope, moves.attack(move));
		}else if(move.type === "reinforce"){
			thread.currentCrawler.receive.call(thread.userScope, moves.reinforce(move));
		}
		threadEntry.moveIndex--;
	};

	var handleOpponentMove = (move) => {
		if(move.type === "attack"){
			moves.attack(move);
		}else if(move.type === "reinforce"){
			moves.reinforce(move);
		}
	};

	var makeMoves = () => {
		var nextMoves = pendingMoves.shift();
		nextMoves.forEach(handleUserMove);
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
			data.moves.forEach(handleOpponentMove);
		}
		if(pendingMoves.length > 0){
			makeMoves();
		}else{
			setTimeout(tryToMove, 20);
		}
	};



	return {
		execute,
		update,
		register: registerThread,
		clearThread,
		options
	};
}
module.exports = MoveHandler;
