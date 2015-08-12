var fs = require("fs");

var nodesArrs = [[{"size":1,"id":0,"URI":"","weight":5}]];
var links = [];
var nodes = [];

var makeNode = function(depth) {
	var index = 0;
	for (var arr = 0; arr < nodesArrs.length; arr++) {
		index += nodesArrs[arr].length;
	}
	var node = {
		"size":1,
		"id": index,
		"URI":"",
		"weight":depth * 5
	};
	var connected = false;
	nodesArrs[depth].push(node);
	for (var i = 0; i < depth * Math.floor(Math.random() * 5); i++) {
		var random = Math.random();
		console.log(random);
		for (var j = depth; j >= Math.floor(depth / 2); j--) {
			console.log(depth / 10);
			if (random < j / 10) {
				links.push({
					"source": Math.floor(Math.random() * nodesArrs[j].length),
					"target": index
				});
				connected = true;
				break;
			}
		}
	}
	if (!connected) {
		links.push({
					"source": Math.floor(Math.random() * index),
					"target": index
				});
	}
};

// pick a length
var DEPTH = 100;

for (var i = 1; i < DEPTH; i++) {
	nodesArrs.push([]);
	for (var j = 0; j < i * Math.floor(Math.random() * 5); j++) {
		makeNode(i);
	}
}



nodes = nodes.concat.apply(nodes, nodesArrs);

var graphjson = {
  "directed": true,
  "graph": [],
  "nodes": nodes,
  "links": links,
  "multigraph": false
};

fs.writeFile("./graph20.json", JSON.stringify(graphjson));
