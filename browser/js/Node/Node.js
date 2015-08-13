define([], function () {

"use strict";
function BuildFactory(options){
	var id = 0;
	var playerColors = ['#ff0000', '#00ff00', '#0000ff','#ffff0'];
	var width = options.width;
	var height = options.height;
	var padding = options.padding;
	var startLocations = [[width / padding, height / 2], [width - width / padding, height / 2]];
	function NodeFactory (isHome) {

		function Node(x, y, maxHealth, resources){
			this.id = id.toString();
			id++;
			this.maxHealth = maxHealth || Infinity;
			this.health = maxHealth || Infinity;
			this.links = [];
			this.playerVisibility = [];
			this.color = 'black';
			this.resources = resources || undefined;
			this.edges = [];
			this.size = 0.03;
			this.x = x;
			this.y = y;
			this.hidden = true;
		}

		// Object.defineProperty(Node,'x', {get: function(){
		// 	return this.location.x;
		// }});

		// Object.defineProperty(Node,'y', {get: function(){
		// 	return this.location.y;
		// }});

		// Node.prototype.addLink = function(arr) {
		// 	this.links = arr;
		// }

		Node.prototype.regenerate = function(){
			setInterval(function(){
				while(this.health < this.maxHealth){
					this.health++
				}
			}, 5000/this.links.length)
		}

		var x, y;
		if(isHome){
			var pos = startLocations.shift();
			x = pos[0];
			y = pos[1];
			var base = new Node(x, y);
			base.color = playerColors.shift();
			base.hidden = false;
			base.size = 0.15;
			return base;
		}else{
			x = Math.floor(Math.random() * width);
			y = Math.floor(Math.random() * height);
			return new Node(x, y);
		}

	};

	return NodeFactory;
}

return BuildFactory;

});

