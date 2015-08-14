define([], function () {
	var view;
	function revealLinks(node, color){
		color = color || "#000000";
		node.color = color;
		var nodes = view.graph.nodes;
		var edges = view.graph.edges;
		var nodelinks = nodes(node.links);
		var nodeedges = edges(node.edges);
		for(var i = 0; i < nodelinks.length; i++){
			nodelinks[i].hidden = false;
			nodeedges[i].hidden = false;
		}
		view.refresh()
		return node;
	}
	function Interface (game) {
		this.playerColor = game.board[game.role];
		view = new sigma({
					graph: game.board,
					renderers: [{
						container: document.getElementById("container"),
						type: "canvas"
					}]
				});
		var clickANode = function (func, event) { func(event.data.node); };
		clickANode = clickANode.bind(this, this.claim.bind(this));
		view.bind("clickNode", clickANode);
	}

	Interface.prototype.claim = function (node) {
		if(typeof node === "string"){
			node = view.graph.nodes(node);
		}
		revealLinks(node, this.playerColor);
	}


	return Interface;
});