var BuildMoves = (options) => {
	var {queue, nodes} = options;

	var attack = (data) => {
		var targetId = data.target;
		var source = nodes(data.source);
		var target = queue(targetId);
		var returnVal = {id: targetId};
		if(source.links.indexOf(targetId) !== -1){
			if (target.health > 0) {
				target.health -= 5;
				console.log(target.health);
			}
			if (target.health <= 0) {
				claim(target, source);
				returnVal.links = target.links;
			}else{
				returnVal.health = target.health;
			}
		}
		return returnVal;
	};


	var reinforce = (data) => {
		var node = queue(data.target);
		if(node.owner){
			var healthDiff = node.maxHealth - node.health;
			if (healthDiff > 0) {
				node.health += healthDiff < 10 ? healthDiff : 10;
				console.log(node.health);
			}
		}
		return {id: data.target, health: node.health};
	};

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

	var claim = (target, source) => {
		var {owner} = source;
		// if(target.id !== view.graph.bases[this.role].id){
		if(!target.from){
			target.from = source.id;
			source.to.push(target.id);
		}else if(target.from && target.owner !== owner){
			var oldFrom = nodes(target.from);
			var toIndex = oldFrom.to.indexOf(target.id);
			if(~toIndex){
				oldFrom.to.splice(toIndex, 1);
			}
			target.from = source.id;
			source.to.push(target.id);
			for(var i = 0, l = target.to.length; i < l; i++){
				removeOwner(target.to.pop());
			}
		}
		// } 
		target.owner = owner;
	};

	//to fix
	// this.moveBase = function(id){
	//     var moveTo = nodes(id);
	//     var oldBase = nodes(graph.bases[role].id);
	//     if (oldBase.links.indexOf(id) !== -1/* && moveTo.color === graph.color*/) {
	//         oldBase.size = 0.03;
	//         oldBase.from = id;
	//         var index = moveTo.to.indexOf(id);
	//         oldBase.to.splice(index,1);

	//         moveTo.size = 0.15;
	//         moveTo.from = undefined;
	//         moveTo.to.push(oldBase.id);

	//         graph.bases[role] = moveTo;
	//     }
	// };

	return {
		attack: attack,
		reinforce: reinforce
	}
};

module.exports = BuildMoves;
