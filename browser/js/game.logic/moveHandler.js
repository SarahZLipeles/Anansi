define(["js/game.logic/buildMoves"], function (BuildMoves) {

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
			threads[threadid] = 0;
		}
		//move could need source
		//needs definitely threadid, target, type
		var update = (move) => {
			var threadEntry = threads[move.threadid];
			var moveSlot = pendingMoves[threadEntry.moveIndex]
			if(moveSlot){
				moveSlot.push(move);
			}else{
				pendingMoves[threadEntry.moveIndex] = [move];
			}
		}

		var handleUserMove = (move) => {
			var threadEntry = threads[move.thread]
			var thread = threadEntry.thread;
			if(move.type === "attack"){
				thread.currentCrawler.receive(moves.attack(move));
			}else if(move.type === "reinforce"){
				thread.currentCrawler.receive(moves.reinforce(move));
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
			var nextMoves = pendingMoves.splice(0, 1);
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
			execute: execute,
			update: update,
			register: registerThread,
			clearThread: clearThread
		};
	}
	return MoveHandler;
});
