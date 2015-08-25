var gameSettings = require('../../settings.js')

"use strict";
function MakeNodes(options){
	var {width, height, spacing, nodeSize} = options;
	var odd = true;
	var startX = spacing;
	var startY = spacing;

	function Nodule(x, y){
		return {
			id: Math.random().toString(32).slice(2),
			maxHealth: gameSettings.maxHealth,
			health: gameSettings.health,
			links: [],
			resources: undefined,
			size: gameSettings.size,
			x: x,
			y: y,
			from: undefined,
			to: [],
			type: "gameNode",
			owner: undefined
		};
	}

	function HexFieldFactory () {
		startX += spacing * 2;
		if(startX > width){
			odd = !odd;
			startX = odd ? spacing * 2 : spacing;
			startY += spacing * 1.5;
			if(startY > height){
				return false;
			}
		}
		return Nodule(startX, startY);
	}

	function getBase(x1, y1, x2, y2, nodes){
		var potentialBases = nodes.filter((node) => {
			return node.x > x1 && node.x < x2 && node.y > y1 && node.y < y2;
		});
		var base = potentialBases[Math.floor(Math.random() * potentialBases.length)];
		base.maxHealth = gameSettings.baseMaxHealth;
		base.health = gameSettings.baseHealth;
		base.size = gameSettings.size * 5;
		return base;
	}


	var node = HexFieldFactory();
	var nodes = [];
	while(node){
		nodes.push(node);
		node = HexFieldFactory();
	}
	var widthPad = width / 6,
		heightPad = height / 6,
		base1 = getBase(widthPad, heightPad, widthPad * 2, height - heightPad, nodes),
		base2 = getBase(width - widthPad * 2, heightPad, width - widthPad, height - heightPad, nodes);

	return {nodes: nodes, base1: base1, base2: base2};	
}

module.exports = MakeNodes;

