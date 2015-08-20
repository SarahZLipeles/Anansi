define([], function () {

	function MoveMachine(options){
		var queue = options.queue,
			nodes = options.nodes,
			opponent = options.opponent,
			pendingMoves = [];

		var removeOwner = (nodeId) => {
			var changeNode = queue(nodeId);
			changeNode.owner = undefined;
			//should flatten in the future, maybe
			changeNode.to.forEach((id) => {
				removeOwner(id);
			});
			changeNode.to.length = 0;
			changeNode.from = undefined;
		};

		var execute = (nodeid, sourceNodeid) => {
			var node = queue(nodeid);
			var sourceNode = nodes(sourceNodeid);
			var owner = sourceNode.owner;
			// if(node.id !== view.graph.bases[this.role].id){
			if(!node.from){
				node.from = sourceNode.id;
				sourceNode.to.push(node.id);
			}else if(node.from && node.owner !== owner){
				var oldFrom = nodes(node.from);
				var toIndex = oldFrom.to.indexOf(node.id);
				if(~toIndex){
					oldFrom.to.splice(toIndex, 1);
				}
				node.from = sourceNode.id;
				sourceNode.to.push(node.id);
				for(var i = 0, l = node.to.length; i < l; i++){
					removeOwner(node.to.pop());
				}
			}
			// }
			node.owner = owner;
		};


		var attempt = (nodeid, sourceNodeid) => {
			var data = {type: "attempt", stamp: Date.now(), target: nodeid, source: sourceNodeid}
			pendingMoves.push(data);
			opponent.send(data);
		}

		var confirm = (data) => {
			var resdata = {type: "confirm", stamp: data.stamp};
			var moveConflict = pendingMoves.find((move) => { 
				return move.target === data.target || move.source === data.target; 
			});
			if(moveConflict){
				resdata.response = moveConflict.stamp > data.stamp ? "success" : "reject";
			}else{
				resdata.response = "success";
			}
			if(resdata.response === "success"){
				execute(data.target, data.source);
			}
			opponent.send(resdata);
		}

		var resolve = (data) => {
			var index = pendingMoves.findIndex((move) => {
				return move.stamp === data.stamp;
			});
			var move = pendingMoves.splice(index, 1);
			if(data.response === "success"){
				execute(move.target, move.source);
			}
		}


		return {
			attempt: attempt,
			confirm: confirm,
			resolve: resolve
		};
	}
	return MoveMachine;
});
