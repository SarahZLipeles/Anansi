/*
"nodes": [
{
	"id": "string",
	"x": num,
	"y": num,
	"label": ~id,
	"size": factor of edges
}]

"edges": [{
	"id": "string",
	"source": nodeID
	"target": nodeID
}]

"board/field": {
	base1,
	base2,
	numNodes,
	width,
	height,
	nodes,
	edges,
	isolatedNodes
}
*/

"use strict";

var ids = [];


function makeField (width, height, numNodes) {
	var index = 2,
		id,
		base1 = {"id": Number(0).toString(36), "x": 0, "y": 0, "links": []},
		base2 = {"id": Number(1).toString(36), "x": width, "y": height, "links": []},
		nodes = [base1, base2];
	ids.push(base1.id);
	ids.push(base2.id);
	for(index = 2; index < numNodes; index++){
		id = index.toString(36);
		ids.push(id);
		nodes.push({"id": id, "x": Math.floor(Math.random() * width), "y": Math.floor(Math.random() * height), "links": []});
	}
	return {
		base1: base1,
		base2: base2,
		nodes: nodes,
		numNodes: numNodes,
		width: width,
		height: height
	};
}

function shouldConnect (node1, node2, radius) {
	var withinRange = Math.sqrt(Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2)) < radius;
	var connectProbability = Math.random() < 0.3;
	return withinRange && connectProbability;
}

function connectField (field, radius, maxConnections) {
	maxConnections = maxConnections || Infinity;
	var edges = [],
		id = 0,
		nodeIndex, nextNodeIndex, currentNode, nextNode;
	for(nodeIndex = 0; nodeIndex < field.numNodes; nodeIndex++){
		currentNode = field.nodes[nodeIndex];
		for(nextNodeIndex = nodeIndex + 1; nextNodeIndex < field.numNodes; nextNodeIndex++){
			nextNode = field.nodes[nextNodeIndex];
			if(shouldConnect(currentNode, nextNode, radius)){
				field.nodes[nodeIndex].links.push(nextNode);
				field.nodes[nextNodeIndex].links.push(currentNode);
				id++;
				edges.push({"id": id.toString(36), "source": currentNode.id, "target": nextNode.id});
			}
		}
	}
	field.edges = edges;
	return field;
}

function checkField (field) {
	var connected = [field.base1.id],
		check = [field.base1],
		checkConnected = function (link) {
			if(connected.indexOf(link.id) === -1){
				connected.push(link.id);
				check.push(link);
			}
		},
		links,
		isolatedNodes;
	while(check.length !== 0){
		links = check.shift().links;
		links.forEach(checkConnected);
	}
	isolatedNodes = ids.filter(function(id){
		return connected.indexOf(id) === -1;
	});
	field.isolatedNodes = isolatedNodes;
	return field;
}

function makeGraph (width, height, numNodes, radius){
	var field = makeField(width, height, numNodes);
	field = connectField(field, radius);
	// field = calculateSize(field);
	field = checkField(field);
	if(field.isolatedNodes.indexOf(field.base2.id) === -1){
		return field;
	}else{
		return makeGraph(width, height, numNodes, radius);
	}
	
}

var board = makeGraph(2000, 800, 3000, 50);

var s = new sigma({
	graph: board,
	container: "container"
});

