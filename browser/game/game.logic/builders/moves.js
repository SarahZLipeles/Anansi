var gameSettings = require('../../../settings.js');

var BuildMoves = (options) => {
	var {queue, nodes, view, role} = options;
	
	var removeOwner = (nodeId) => {
		var changeNode = queue(nodeId);
		changeNode.owner = undefined;
		changeNode.to.forEach((id) => removeOwner(id));
		changeNode.to.length = 0;
		changeNode.from = undefined;
	};

	var claim = (target, source) => {
		if(target.from){
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
		}else{
			target.from = source.id;
			source.to.push(target.id);
		}
		target.owner = source.owner;
		target.health = gameSettings.healthOnClaim(target.maxHealth);
	};

	var attack = (data) => {
		var targetId = data.target;
		var source = nodes(data.source);
		var target = queue(targetId, data.source);
		var returnVal = {id: targetId};
		var renderType = {partial: true};

		if(source.owner === data.role && source.owner !== target.owner && source.links.indexOf(targetId) !== -1){
			if(target.owner === role){
				$('.game').trigger('startRumble');
			}
			if (target.health > 0) {
				target.health -= gameSettings.attackBy;
			}
			if (target.health <= 0) {
				claim(target, source);
				returnVal.links = target.links;
				returnVal.message = "claimed";
				renderType.claim = true;
			}else{
				returnVal.health = target.health;
				returnVal.message = "damaged";
			}
			view.refresh(renderType);
			if(renderType.claim){
				$('.game').boardNav('update');
			}
		}else{
			returnVal.message = "invalid";
		}
		return returnVal;
	};


	var reinforce = (data) => {
		var node = queue(data.target);
		var returnVal = {id: data.target};
		if(node.owner === data.role){
			var healthDiff = node.maxHealth - node.health;
			if (healthDiff > 0) {
				node.health += healthDiff < gameSettings.reinforceBy ? healthDiff : gameSettings.reinforceBy;
			}
			returnVal.health = node.health;
			returnVal.message = "reinforced";
			view.refresh({partial: true});
		}else{
			returnVal.message = "invalid";
		}
		return returnVal;
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
