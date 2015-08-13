define([], function () {
	var view;
	function revealLinks(node, color){
		color = color || "#000000";
		var nodes = view.graph.nodes;
		var edges = view.graph.edges;
		var nodelinks = nodes(node.links);
		var nodeedges = edges(node.edges);
		for(var i = 0; i < nodelinks.length; i++){
			nodelinks[i].hidden = false;
			nodelinks[i].color = color;
			nodeedges[i].hidden = false;
			nodeedges[i].color = color;
		}
		view.refresh()
		return node;
	}
	function Interface (board) {
		view = new sigma({
					graph: board,
					renderers: [{
						container: document.getElementById("container"),
						type: "canvas"
					}]
				});
		var clickANode = function (event) { revealLinks(event.data.node) };
		view.bind("clickNode", clickANode);
	}


	return Interface;
});