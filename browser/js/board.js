// var fs = require("fs");

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

var ids = [];

function makeField (width, height, numNodes) {
	var index = 0;
	var base1 = {"id": index.toString(36), "x": 0, "y": 0, "links": []};
	ids.push(base1.id);
	index++;
	var base2 = {"id": index.toString(36), "x": width, "y": height, "links": []};
	ids.push(base2.id);
	var nodes = [base1, base2];
	for(index = 2; index < numNodes; index++){
		var id = index.toString(36);
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

function connectField (field, radius, maxConnections) {
	maxConnections = maxConnections || Infinity;
	var connections = [];
	var id = 0;
	for(var nodeIndex = 0; nodeIndex < field.numNodes; nodeIndex++){
		var currentNode = field.nodes[nodeIndex];
		for(var nextNodeIndex = nodeIndex + 1; nextNodeIndex < field.numNodes; nextNodeIndex++){
			var nextNode = field.nodes[nextNodeIndex];
			if(Math.sqrt(Math.pow(currentNode.x - nextNode.x, 2) + Math.pow(currentNode.y - nextNode.y, 2)) < radius){
				// console.log(currentNode.links);
				field.nodes[nodeIndex].links.push(nextNode);
				field.nodes[nextNodeIndex].links.push(currentNode);
				id++;
				connections.push({"id": id.toString(36), "source": currentNode.id, "target": nextNode.id});
			}
		}
	}
	field.edges = connections;
	return field;
}

function checkField (field) {
	var connected = [field.base1.id];
	var check = [field.base1];
	while(check.length !== 0){
		var links = check.shift().links;
		links.forEach(function(link) {
			if(connected.indexOf(link.id) === -1){
				connected.push(link.id);
				check.push(link);
			}
		});
	}
	var isolatedNodes = ids.filter(function(id){
		return connected.indexOf(id) === -1;
	});
	field.isolatedNodes = isolatedNodes;
	return field;
}

//check if connected to base
//check if connected to connected to base
//



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

var board = makeGraph(2000, 800, 2000, 50);

var s = new sigma({
	graph: board,
	container: "container"
});

// fs.writeFile("../../graph20.json", JSON.stringify(makeGraph(1000, 5000, 30)));
