define([], function () {
	var view, board;
	var obj = {};
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
		this.opponent = game.opponent;
		board = game.board;
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

	Interface.prototype.addOpponent = function (opponent) {
		this.opponent = opponent;
	}

	Interface.prototype.claim = function (node) {
		revealLinks(node, this.playerColor);
		this.opponent.send({type: "move", data: node.id, color: this.playerColor});
	}

	Interface.prototype.updateNode = function (nodeid, color) {
		var node = view.graph.nodes(nodeid);
		revealLinks(node, color);
	}


	return Interface;
});