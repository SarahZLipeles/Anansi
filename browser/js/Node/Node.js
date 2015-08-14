define([], function () {

"use strict";
function BuildFactory(options){
	var id = -1;
	var obj = {};
	var playerColors = ['#ff0000', '#00ff00', '#0000ff','#ffff0'];
	var width = options.width;
	var height = options.height;
	var padding = options.padding;
	var startLocations = [[width / padding, height / 2], [width - width / padding, height / 2]];
	function NodeFactory (isHome) {

		function Nodule(x, y, maxHealth, resources){
			id++;
			return {
				id: id.toString(),
				// maxHealth: maxHealth || Infinity,
				// health: maxHealth || Infinity,
				links: [],
				playerVisibility: [],
				color: 'black',
				// resources: resources || undefined,
				edges: [],
				size: 0.03,
				x: x,
				y: y,
				hidden: true,
				// constructor: obj.constructor
			}
		}

		// Object.defineProperty(Nodule,'x', {get: function(){
		// 	return this.location.x;
		// }});

		// Object.defineProperty(Nodule,'y', {get: function(){
		// 	return this.location.y;
		// }});

		// Nodule.prototype.addLink = function(arr) {
		// 	this.links = arr;
		// }

		// Nodule.prototype.regenerate = function(){
		// 	setInterval(function(){
		// 		while(this.health < this.maxHealth){
		// 			this.health++
		// 		}
		// 	}, 5000/this.links.length)
		// }

		var x, y;
		if(isHome){
			var pos = startLocations.shift();
			x = pos[0];
			y = pos[1];
			var base = Nodule(x, y);
			console.log()
			base.color = playerColors.shift();
			base.hidden = false;
			base.size = 0.15;
			return base;
		}else{
			x = Math.floor(Math.random() * width);
			y = Math.floor(Math.random() * height);
			return Nodule(x, y);
		}

	};

	return NodeFactory;
}

return BuildFactory;

});

