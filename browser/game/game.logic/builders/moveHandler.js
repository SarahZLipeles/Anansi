var BuildMoves = require("./moves");

function MoveHandler(options){
	var threads = {},
		threadids = [],
		{opponent} = options,
		moves = BuildMoves(options);

	var registerThread = (thread) => {
		threads[thread.id] = {thread: thread, pending: []};
		threadids = Object.keys(threads);
		return threads;
	};

	var clearThread = (threadid) => {
		var thread = threads[threadid];
		thread.pending.length = 0;
		return threads;
	};

	var update = (move) => {
		var thread = threads[move.thread];
		thread.pending.push(move);
		return threads;
	}

	var handleUserMove = (move) => {
		var thread = threads[move.thread].thread;
		if(move.type === "attack"){
			thread.currentCrawler.receive.call(thread.userScope, moves.attack(move));
		}else if(move.type === "reinforce"){
			thread.currentCrawler.receive.call(thread.userScope, moves.reinforce(move));
		}
	};

	var handleOpponentMove = (move) => {
		if(move.type === "attack"){
			moves.attack(move);
		}else if(move.type === "reinforce"){
			moves.reinforce(move);
		}
	};

	var execute = (data) => {
		var nextMoves = [], pending;
		data.moves.forEach(handleOpponentMove);
		threadids.forEach((id) => {
			if(pending = threads[id].pending.shift()){ 
				nextMoves.push(pending);
			}
		});
		opponent.send({type: "move", moves: nextMoves});
		nextMoves.forEach(handleUserMove);
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
