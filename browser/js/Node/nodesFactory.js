"use strict";

function createMaop(){}

function createNodes(width, height, numNodes){
	var index = 0;
	var ids = [];
	this.homeBases = {};
	this.nodes = [];


	homeBases.base1 = function(){
		var base = new Node(Number(0).toString(36), 5000, 0, 0);
		base.color='red';
		return base;
	}
	homeBases.base2 = function(){
		var base = new Node(Number(1).toString(36), 5000, width, height);
		base.color='blue';
		return base;
	}

	for(index = 2; index < numNodes; index++){
		id = index.toString(36);
		ids.push(id);
		nodes.push(new Node(id, 100, Math.floor(Math.random() * width, Math.floor(Math.random() * height))
	}

}

var n = new createNodes();

function connectNodes (){
	n.Nodes.forEAch
}
