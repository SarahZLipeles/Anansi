define([], function () {

"use strict";
function BuildFactory(options){
	var id = -1;
	var playerColors = ['#ff0000', '#00ff00', '#0000ff','#ffff0'];
	var width = options.width;
	var height = options.height;
	var padding = options.padding;
	var startLocations = [[width / padding, height / 2], [width - width / padding, height / 2]];

	function Nodule(x, y, maxHealth, resources){
		id++;
		return {
			id: id.toString(),
			maxHealth: maxHealth || 5000,
			health: maxHealth || 5000,
			links: [],
			playerVisibility: [],
			color: "#000000",
			resources: resources || undefined,
			edges: [],
			size: 0.03,
			x: x,
			y: y,
			hidden: true,
			from: [],
			to: []
		}
	}

	function RandomNodeFactory (isHome) {
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
			x = Math.floor(Math.random() * width);
			y = Math.floor(Math.random() * height);
			return Nodule(x, y);
		}
	}

	function HexFieldFactory () {
		
	}


	if(options.fieldType === "random"){
		return RandomNodeFactory;
	}
	
}

return BuildFactory;

});

