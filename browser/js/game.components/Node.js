define([], function () {

"use strict";
function BuildFactory(options){
	var id = -1;
	var playerColors = ['#ff0000', '#00ff00', '#0000ff','#ffff0'];
	var width = options.width;
	var height = options.height;
	var padding = options.padding;
	var startLocations = [[width / padding, height / 2], [width - width / padding, height / 2]];
	var numNodes = options.numNodes;
	var spacing = 15;
	var odd = true;
	var startX = spacing;
	var startY = spacing;

	function Nodule(x, y, maxHealth, resources){
		id++;
		return {
			id: id.toString(),
			maxHealth: maxHealth || 10,
			health: maxHealth || 10,
			links: [],
			color: "#000000",
			resources: resources || undefined,
			edges: [],
			size: 0.03,
			x: x,
			y: y,
			hidden: false,
			from: undefined,
			to: [],
			type: "gameNode"
		}
	}

	function RandomFieldFactory (isHome) {
		var x, y, pos, base;
		if(isHome){
			pos = startLocations.shift();
			x = pos[0];
			y = pos[1];
			base = Nodule(x, y);
			base.color = playerColors.shift();
			base.size = 0.15;
			return base;
		}else if(id === numNodes){
			return false;
		}else{
			x = Math.floor(Math.random() * width);
			y = Math.floor(Math.random() * height);
			return Nodule(x, y);
		}
	}

	function HexFieldFactory (isHome) {
		var x, y, pos, base;
		if(isHome){
			pos = startLocations.shift();
			x = pos[0];
			y = pos[1];
			base = Nodule(x, y);
			base.color = playerColors.shift();
			base.size = 0.15;
			return base;
		}else{
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
	}


	if(options.fieldType === "random"){
		return RandomFieldFactory;
	}else if(options.fieldType === "hex"){
		return HexFieldFactory
	}
	
}

return BuildFactory;

});

