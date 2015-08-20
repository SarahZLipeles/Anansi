define(["js/game.components/Node"], function (BuildFactory) {

"use strict";

var ids = [];

function makeField (options) {
	var NodeFactory = BuildFactory(options),
		bases = {host: NodeFactory(true), client: NodeFactory(true)},
		node = NodeFactory(),
		nodes = [bases.host, bases.client];

	ids.push(bases.host.id);
	ids.push(bases.client.id);

	while(node){
		nodes.push(node);
		ids.push(node.id);
		node = NodeFactory();
	}

	return {
		bases: bases,
		nodes: nodes,
		numNodes: nodes.length,
		width: options.width,
		height: options.height
	};
}

function withinRange (node1, node2, radii){
	var dist = Math.sqrt(Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2));
	return dist < radii.outer && dist > radii.inner;
}

// function restrictMaxNodes (node1, node2, maxConnections) {
// 	var chanceConnect = 1;
// 	var node1ok = node1.links.length / maxConnections < chanceConnect;
// 	var node2ok = node2.links.length / maxConnections < chanceConnect;
// 	return node1ok && node2ok;
// }

function withinRadius (node1, node2, radii) {
	return Math.sqrt(Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2)) < radii.outer;
}

// function outsideRadius (node1, node2, radii) {
// 	return Math.sqrt(Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2)) > radii.inner;
// }

function clearBaseArea(field, radii) {
	var host = field.bases.host,
		client = field.bases.client,
		proximity = {outer: radii.outer - 20};
	field.nodes = field.nodes.map(function (node) {
		if(node.id === host.id || node.id === client.id){
			return node;
		}else if(withinRadius(host, node, proximity) || withinRadius(client, node, proximity)){
			return undefined;
		}else{
			return node;
		}
	});
	return field;
}


function connectField (field, radii, maxConnections) {
	maxConnections = maxConnections || Infinity;
	var edges = [],
		id = 0,
		potentialConnections,
		nodeIndex, nextNodeIndex, currentNode, nextNode,
		edge,
		tryToConnect = function (node) {
			if(currentNode.id === field.bases.host.id || currentNode.id === field.bases.client.id || Math.random() < 0.5){
				edge = {
					id: id.toString(), 
					source: currentNode.id, 
					target: node,
					type: "gameEdge"
				}
				field.nodes[nodeIndex].links.push(node);
				field.nodes[node].links.push(currentNode.id);
				id++;
				edges.push(edge);
			}
		};

	for(nodeIndex = 0; nodeIndex < field.numNodes; nodeIndex++){
		if(typeof field.nodes[nodeIndex] === "undefined") { continue; }
		potentialConnections = [];
		for(nextNodeIndex = nodeIndex + 1; nextNodeIndex < field.numNodes; nextNodeIndex++){
			//This needs to go here so current node will have the proper number of links each time
			currentNode = field.nodes[nodeIndex];
			nextNode = field.nodes[nextNodeIndex];
			if(typeof nextNode === "undefined"){ continue; }
			if(withinRange(currentNode, nextNode, radii)){
				potentialConnections.push(nextNode.id);
			}
		}
		potentialConnections.forEach(tryToConnect);
	}

	field.edges = edges;
	return field;
}

function wiggleNodes (field, factors) {
	var nodes = field.nodes,
		xfactor = typeof factors === "object" ? factors.x : factors,
		yfactor = typeof factors === "object" ? factors.y : factors;
	nodes.forEach(function (node) {
		if(node){
			node.x = node.x + (Math.random() - 0.5) * xfactor;
			node.y = node.y + (Math.random() - 0.5) * yfactor;
		}
	});
}

//Checks if the bases are connected 
function checkField (field) {
	var connected = [field.bases.host.id],
		check = [field.bases.host],
		checkConnected = function (linkid, index, links) {
			if(connected.indexOf(linkid) === -1){
				connected.push(linkid);
				if(field.nodes[linkid] === undefined) console.log(linkid, links);
				check.push(field.nodes[linkid]);
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
	//Filter out isolated nodes
	field.nodes = field.nodes.filter(function (node) {
		return node && !~isolatedNodes.indexOf(node.id);
	});
	//Filter out the edges that attach isolated nodes
	field.edges = field.edges.filter(function (edge) {
		return !~isolatedNodes.indexOf(edge.source) && !~isolatedNodes.indexOf(edge.target);
	})

	//Check if the two bases are connected
	return isolatedNodes.indexOf(field.bases.client.id) === -1 ? field : false;
}

function makeGraph (fieldOptions, radii, maxConnections){
	var field = makeField(fieldOptions);
	field = clearBaseArea(field, radii);
	field = connectField(field, radii, maxConnections);
	wiggleNodes(field, 20);
	return checkField(field) || makeGraph(fieldOptions, radii, maxConnections);
}

var fieldOptions = {
	width: 100,
	height: 100,
	numNodes: 500,
	padding: 10,
	fieldType: "hex"
};

//Board notes
//withinRange({inner: 15, outer:30-33}) decent setting, stringy, lots of dead ends
//still need clipping of dense nodes


return {
	generate: function () { return makeGraph(fieldOptions, {inner: 0, outer: 33}, 5); }
};

});
