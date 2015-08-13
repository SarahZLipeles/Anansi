"use strict";

function createNodes(width, height, numNodes){
	var index = 2
	var ids = []
	this.homeBases = []
	this.nodes = []

	var base1 = function(){
		return new Node(Number(0).toString(36), 5000, 0, 0);
	}
	var base2 = function(){
		return new Node(Number(1).toString(36), 5000, width, height);
	}

	this.homeBases.push(base1);
	this.homeBases.push(base2);


	nodes.push(base1)
	nodes.push(base2)

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
