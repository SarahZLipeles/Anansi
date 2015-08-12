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
	var nodes = [{"id":index.toString(36), "x": 0, "y": 0}];
	index++;
	nodes.push({"id": index.toString(36), "x": size, "y": size});
	for(index = 2; index < numNodes; index++){
		nodes.push({"id": index.toString(36), "x": Math.floor(Math.random() * size), "y": Math.floor(Math.random() * size)});
	}
	return {
		nodes: nodes,
		connections: []
	}
}

function connectField(field, radius, maxConnections) {

}






function makeGraph (size, numNodes){
	var field = makeField(size, numNodes);
	field = connectField(field, radius, maxConnections);
	field = calculateSize(field);
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
