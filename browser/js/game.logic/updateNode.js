define([], function () {

	function UpdateBuilder(queue, nodes){
		var makeBlack = function(nodeId){
			var changeNode = queue(nodeId);
			changeNode.owner = undefined;
			//should flatten in the future, maybe
			changeNode.to.forEach(function(id){
				makeBlack(id);
			});
			changeNode.to.length = 0;
			changeNode.from = undefined;
		};
		var updateNode = function (nodeid, sourceNodeid) {
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
					makeBlack(node.to.pop());
				}
			}
			// }
			node.owner = owner;
		};
		return updateNode;
	}
	return UpdateBuilder;
});