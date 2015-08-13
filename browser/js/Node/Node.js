pwd// node class

// Bryan Chu [5:58 PM]
// properties
// 1. health
// 2. links[other nodes]
// 3. whohasvisibility [players]
// 4. state
// 5. resources
// 6. location

// prototype method
// 1. add links to itself
// 2. regenerate health
// 3. emit visibility[who are my children]
// 4. emit on capture [resources]

"use strict";

function Node(id, maxHealth, x, y){
	this.id = id;
	this.maxHealth = maxHealth;
	this.health = maxHealth;
	this.links = [];
	this.visibility = [];
	this.color = 'black';
	this.resources = 0;
	this.location = {x:x , y:y};
	get x (){
		return this.location.x
	}
	get y (){
		return this.location.y
	}
}

Node.prototype.addLink = function(arr) {
	this.links = arr
}

Node.prototype.regenerate = function(){
	setInterval(function(){
		while(this.health < this.maxHealth){
			this.health++
		}
	}, 5000/this.links.length)
}
