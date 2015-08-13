define([], function () {
	var view;
	var revealLinks = 
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