define(["js/Node/Node"], function (BuildFactory) {

"use strict";

var ids = [];

function makeField (options) {
	var NodeFactory = BuildFactory(options),
		bases = {host: NodeFactory(true), client: NodeFactory(true)},
		host = bases.host.color,
		client = bases.client.color,
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
		host: host,
		client: client,
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

function restrictMaxNodes (node1, node2, maxConnections) {
	var chanceConnect = 1;
	var node1ok = node1.links.length / maxConnections < chanceConnect;
	var node2ok = node2.links.length / maxConnections < chanceConnect;
	return node1ok && node2ok;
}

function withinRadius (node1, node2, radii) {
	return Math.sqrt(Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2)) < radii.outer;
}

function outsideRadius (node1, node2, radii) {
	return Math.sqrt(Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2)) > radii.inner;
}

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
		potentialConnections = [],
		nodeIndex, nextNodeIndex, currentNode, nextNode,
		edge;
	for(nodeIndex = 0; nodeIndex < field.numNodes; nodeIndex++){
		if(field.nodes[nodeIndex] === undefined) {
			continue;
		}
		potentialConnections = [];
		for(nextNodeIndex = nodeIndex + 1; nextNodeIndex < field.numNodes; nextNodeIndex++){
			//This needs to go here so current node will have the proper number of links each time
			currentNode = field.nodes[nodeIndex];
			nextNode = field.nodes[nextNodeIndex];
			if(nextNode === undefined){
				continue;
			}
			if(withinRange(currentNode, nextNode, radii)){
				//for some reason currentNode and nextNode are acting like copies, not references.  Why???
				potentialConnections.push(nextNode.id);
			}
		}
		potentialConnections.forEach(function (potentialNode){
			if(currentNode.id === field.bases.host.id || currentNode.id === field.bases.client.id){
				edge = {
					id: id.toString(), 
					source: currentNode.id, 
					target: potentialNode,
					color: "#000000",
					hidden: false,
					type: "gameEdge"
				}
				field.nodes[nodeIndex].links.push(potentialNode);
				field.nodes[nodeIndex].edges.push(edge.id);
				field.nodes[potentialNode].links.push(currentNode.id);
				field.nodes[potentialNode].edges.push(edge.id);
				id++;
				edges.push(edge);
			}else if(Math.random() < 0.5){
				edge = {
					id: id.toString(), 
					source: currentNode.id, 
					target: potentialNode,
					color: "#000000",
					hidden: false,
					type: "gameEdge"
				}
				field.nodes[nodeIndex].links.push(potentialNode);
				field.nodes[nodeIndex].edges.push(edge.id);
				field.nodes[potentialNode].links.push(currentNode.id);
				field.nodes[potentialNode].edges.push(edge.id);
				id++;
				edges.push(edge);
			}
		});
	}
	field.edges = edges;
	return field;
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
	//Still need this to check if bases.client is connected
	field.isolatedNodes = isolatedNodes;
	//Filter out isolated nodes
	field.nodes = field.nodes.filter(function (node) {
		return node && !~isolatedNodes.indexOf(node.id);
	});
	//Filter out the edges that attach isolated nodes
	field.edges = field.edges.filter(function (edge) {
		return !~isolatedNodes.indexOf(edge.source) && !~isolatedNodes.indexOf(edge.target);
	})
	return field;
}

function makeGraph (fieldOptions, radii, maxConnections){
	var field = makeField(fieldOptions);
	field = clearBaseArea(field, radii);
	field = connectField(field, radii, maxConnections);
	field = checkField(field);
	if(field.isolatedNodes.indexOf(field.bases.client.id) === -1){
		return field;
	}else{
		return makeGraph(fieldOptions, radii);
	}
}

var fieldOptions = {
	width: 1000,
	height: 500,
	numNodes: 1300,
	padding: 10,
	fieldType: "hex"
};

//Board notes
//withinRange({inner: 15, outer:30-33}) decent setting, stringy, lots of dead ends
//still need clipping of dense nodes



return {
	generate: function () {
		return makeGraph(fieldOptions, {inner: 0, outer: 33}, 5);
	}
}

});
