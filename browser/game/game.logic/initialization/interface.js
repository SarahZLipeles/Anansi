var gameSettings = require("../../../settings"),
	setControls = require("./controls").setControls,
	setBases = require("./setBases"),
	MakeMoveHandler = require("../builders/moveHandler");
	
"use strict";

var view, handleMove;

function initGlobals (s, game) {
	view = s;
	handleMove = MakeMoveHandler({
		view,
		queue: s.graph.queueNodes,
		nodes: s.graph.nodes,
		opponent: game.opponent,
		role: game.role
	});
}

function Interface (game, playerData) {
	this.role = game.role; //"host or client"
	var basePos = setBases(game, playerData);
	initGlobals(new sigma(
		{
			graph: game.board,
			renderers: [{
				container: document.getElementById("container"),
				type: "gameSvg",
				settings: {
					enableHovering: true
				}
			}],
			settings: {
				drawLabels: false,
				host: game.role === "host" ? playerData.playerColor : playerData.opponentColor,
				client: game.role === "client" ? playerData.playerColor : playerData.opponentColor,
				player: game.role,
				width: game.board.width,
				height: game.board.height,
				defaultNodeColor: gameSettings.default,
				defaultEdgeColor: gameSettings.default
			}
		}
	), game);
	
	$('.game').mgMiniMap({draggable: true});

	setControls({
		handler: handleMove, 
		view,
		basePos
	});
	view.refresh();
}

Interface.prototype.updateBoard = function (data) {
	handleMove.execute(data);
};

module.exports = Interface;
