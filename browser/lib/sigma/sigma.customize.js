define(["lib/sigma/sigma.renderers.gameSvg", 
	"lib/sigma/sigma.svg.gameEdge", 
	"lib/sigma/sigma.svg.gameNode", 
	"lib/sigma/sigma.svg.healthLabel",
	"js/game.components/style"], 
	function (renderer, edge, node, label, style) {
		renderer();
		edge(style);
		node();
		label();
});
