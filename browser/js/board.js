var fs = require("fs");

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


*/

function makeField (size, numNodes) {
	var index = 0;
	var base1 = {"id": index.toString(36), "x": 0, "y": 0};
	index++;
	var base2 = {"id": index.toString(36), "x": size, "y": size};
	var nodes = [base1, base2];
	for(index = 2; index < numNodes; index++){
		nodes.push({"id": index.toString(36), "x": Math.floor(Math.random() * size), "y": Math.floor(Math.random() * size)});
	}
	return {
		base1: base1,
		base2: base2,
		nodes: nodes,
		numNodes: numNodes,
		size: size
	};
}

function connectField (field, radius, maxConnections) {
	maxConnections = maxConnections || Infinity;
	var connections = [];
	for(var nodeIndex = 0; nodeIndex < field.numNodes; nodeIndex++){
		var currentNode = field.nodes[nodeIndex];
		for(var nextNodeIndex = currentNode + 1; nextNodeIndex < field.numNodes; nextNodeIndex++){
			var nextNode = field.nodes[nextNode];
			if(Math.sqrt(Math.pow(currentNode.x - nextNode.x, 2) + Math.pow(currentNode.y - nextNode.y, 2)) < radius){
				connections.push({"id": nodeIndex.toString(36) + nextNodeIndex.toString(36), "source": currentNode.id, "target": nextNode.id});
			}
		}
	}
	field.connections = connections;
	return field;
}

function checkField (field) {
	
}





function makeGraph (size, numNodes){
	var field = makeField(size, numNodes);
	field = connectField(field, radius, maxConnections);
	// field = calculateSize(field);
	field = checkField(field);
}

var index = 0;
// var nodesArrs = [];
var edges = [];
var nodes = [{"id":index.toString(36), "x": 0, "y": 0}];



var graphjson = {
  "directed": true,
  "graph": [],
  "nodes": nodes,
  "links": links,
  "multigraph": false
};

fs.writeFile("./graph20.json", JSON.stringify(graphjson));
