define(["js/game.components/style.js"], function (style) {

"use strict";
function BuildFactory(options){
	var id = -1;
	var width = options.width;
	var height = options.height;
	var padding = options.padding;
	var startLocations = [[width / padding, height / 2], [width - width / padding, height / 2]];
	var numNodes = options.numNodes;
	var spacing = 15;
	var odd = true;
	var startX = spacing;
	var startY = spacing;

	function Nodule(x, y){
		id++;
		this.id = id.toString();
		this.maxHealth = 10;
		this.health = 10;
		this.links = [];
		this.color = style.default;
		this.resources = undefined;
		this.size = 0.03;
		this.x = x;
		this.y = y;
		this.hidden = false;
		this.from = undefined;
		this.to = [];
		this.type = "gameNode";
	}

	Nodule.prototype.basify = function () {
		this.maxHealth = 50;
		this.health = 50;
		this.size = 0.15;
	}

	function RandomFieldFactory (isHome) {
		var x, y, pos, base;
		if(isHome){
			pos = startLocations.shift();
			x = pos[0];
			y = pos[1];
			base = new Nodule(x, y);
			base.basify();
			return base;
		}else if(id === numNodes){
			return false;
		}else{
			x = Math.floor(Math.random() * width);
			y = Math.floor(Math.random() * height);
			return new Nodule(x, y);
		}
	}

	function HexFieldFactory (isHome) {
		var x, y, pos, base;
		if(isHome){
			pos = startLocations.shift();
			x = pos[0];
			y = pos[1];
			base = new Nodule(x, y);
			base.basify();
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
			return new Nodule(startX, startY);
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

