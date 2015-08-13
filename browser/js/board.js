define(["js/Node/Node"], function (BuildFactory) {

"use strict";

var ids = [];

function makeRandomField (options) {
	var NodeFactory = BuildFactory(options);
	var width = options.width,
		height = options.height,
		numNodes = options.numNodes,
		padding = options.padding || 1,

		index = 2,
		id,
		base1 = NodeFactory(true),
		base2 = NodeFactory(true),
		nodes = [base1, base2];
	ids.push(base1.id);
	ids.push(base2.id);

	for(index = 2; index < numNodes; index++){
		id = index.toString();
		ids.push(id);
		nodes.push(NodeFactory());
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


function revealLinks(node, field, color){
	if (field) return node;
	var nodes = field ? field.nodes : s.graph.nodes;
	var edges = field ? field.edges : s.graph.edges;
	var nodelinks = nodes(node.links);
	var nodeedges = edges(node.edges);
	for(var i = 0; i < nodelinks.length; i++){
		if (field) {
			// nodes[nodelinks[i]].hidden = false;
			// edges[nodeedges[i]].hidden = false;
		} else {
			console.log(nodeedges);
			nodelinks[i].hidden = false;
			nodelinks[i].color = color;
			nodeedges[i].hidden = false;
			nodeedges[i].color = color;
		}
	}

	if(s){
		s.refresh();
	}
	return node;

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

function connectField (field, radii, maxConnections) {
	maxConnections = maxConnections || Infinity;
	var edges = [],
		id = 0,
		nodeIndex, nextNodeIndex, currentNode, nextNode;
	for(nodeIndex = 0; nodeIndex < field.numNodes; nodeIndex++){
		for(nextNodeIndex = nodeIndex + 1; nextNodeIndex < field.numNodes; nextNodeIndex++){
			//This needs to go here so current node will have the proper number of links each time
			currentNode = field.nodes[nodeIndex];
			nextNode = field.nodes[nextNodeIndex];
			if(withinRange(currentNode, nextNode, radii) && restrictMaxNodes(currentNode, nextNode, maxConnections)){
				//for some reason currentNode and nextNode are acting like copies, not references.  Why???
				var edge = {
					id: id.toString(), 
					source: currentNode.id, 
					target: nextNode.id,
					color: "#000000",
					hidden: true
				}
				field.nodes[nodeIndex].links.push(nextNode.id);
				field.nodes[nodeIndex].edges.push(edge.id);
				field.nodes[nextNodeIndex].links.push(currentNode.id);
				field.nodes[nextNodeIndex].edges.push(edge.id);
				id++;
				edges.push(edge);
			}
		}
	}
	field.edges = edges;
	return field;
}

//Checks if the bases are connected 
function checkField (field) {
	var connected = [field.base1.id],
		check = [field.base1],
		checkConnected = function (linkid) {
			if(connected.indexOf(linkid) === -1){
				connected.push(linkid);
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
	//Still need this to check if base2 is connected
	field.isolatedNodes = isolatedNodes;
	//Filter out isolated nodes
	field.nodes = field.nodes.filter(function (node) {
		return !~isolatedNodes.indexOf(node.id);
	});
	//Filter out the edges that attach isolated nodes
	field.edges = field.edges.filter(function (edge) {
		return !~isolatedNodes.indexOf(edge.source) && !~isolatedNodes.indexOf(edge.target);
	})
	return field;
}

function makeGraph (fieldOptions, radii, maxConnections){
	var field = makeRandomField(fieldOptions);
	field = connectField(field, radii, maxConnections);
	// field = calculateSize(field);
	field = checkField(field);
	if(field.isolatedNodes.indexOf(field.base2.id) === -1){
		revealLinks(field.base1, field);
		revealLinks(field.base2, field);
		return field;
	}else{
		return makeGraph(fieldOptions, radii);
	}
}

var fieldOptions = {
	width: 1000,
	height: 500,
	numNodes: 1300,
	padding: 10
};

//Board notes
//withinRange({inner: 15, outer:30-33}) decent setting, stringy, lots of dead ends
//still need clipping of dense nodes



return {
	generate: function () {
		return makeGraph(fieldOptions, {inner: 15, outer: 33}, 4);
	}
}

});
