pwd// node class

// Bryan Chu [5:58 PM]
// properties
// 1. health
// 2. links[other nodes]
// 3. whohasvisibility [players]
// 4. state
// 5. resources
// 6. location

// prototype method
// 1. add links to itself
// 2. regenerate health
// 3. emit visibility[who are my children]
// 4. emit on capture [resources]

///*
//"nodes": [
//{
//	"id": "string",
//	"x": num,
//	"y": num,
//	"label": ~id,
//	"size": factor of edges
//}]
//
//"edges": [{
//	"id": "string",
//	"source": nodeID
//	"target": nodeID
//}]
//
//"board/field": {
//	base1,
//	base2,
//	numNodes,
//	width,
//	height,
//	nodes,
//	edges,
//	isolatedNodes
//}
//*/
//
//"use strict";
//
//var ids = [];
//
//
//function makeRandomField (options) {
//	var width = options.width,
//		height = options.height,
//		numNodes = options.numNodes,
//		padding = options.padding || 1,
//
//		index = 2,
//		id,
//		base1 = {
//			id: Number(0).toString(36),
//			x: width / padding,
//			y: height / 2,
//			links: [],
//			edges: [],
//			size: 0.2,
//			color: "#ff0000"
//		},
//		base2 = {
//			id: Number(1).toString(36),
//			x: width - width / padding,
//			y: height / 2,
//			links: [],
//			edges: [],
//			size: 0.2,
//			color: "#0000ff"
//		},
//		nodes = [base1, base2];
//	ids.push(base1.id);
//	ids.push(base2.id);
//
//	for(index = 2; index < numNodes; index++){
//		id = index.toString(36);
//		ids.push(id);
//		nodes.push({
//			id: id,
//			x: Math.floor(Math.random() * width),
//			y: Math.floor(Math.random() * height),
//			links: [],
//			edges: [],
//			size: 0.03,
//			color: "#000000",
//			hidden: true
//		});
//	}
//	return {
//		base1: base1,
//		base2: base2,
//		nodes: nodes,
//		numNodes: numNodes,
//		width: width,
//		height: height
//	};
//}
//
//var g;
//function revealLinks(node){
//	var links = node.links;
//	var edges = node.edges;
//	g = links[0];
//	console.log(links);
//	for(var i = 0; i < links.length; i++){
//		links[i].color = "#000000";
//		links[i].hidden = false;
//		edges[i].color = "#000000";
//		edges[i].hidden = false;
//	}
//	if(s){
//		console.log("refresh");
//		s.refresh();
//	}
//}
//
//function withinRange (node1, node2, radii){
//	var dist = Math.sqrt(Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2));
//	return dist < radii.outer && dist > radii.inner;
//}
//
//function restrictMaxNodes (node1, node2, maxConnections) {
//	var chanceConnect = 1;
//	var node1ok = node1.links.length / maxConnections < chanceConnect;
//	var node2ok = node2.links.length / maxConnections < chanceConnect;
//	return node1ok && node2ok;
//}
//
//function withinRadius (node1, node2, radii) {
//	return Math.sqrt(Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2)) < radii.outer;
//}
//
//function outsideRadius (node1, node2, radii) {
//	return Math.sqrt(Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2)) > radii.inner;
//}
//
//function connectField (field, radii, maxConnections) {
//	maxConnections = maxConnections || Infinity;
//	var edges = [],
//		id = 0,
//		nodeIndex, nextNodeIndex, currentNode, nextNode;
//	for(nodeIndex = 0; nodeIndex < field.numNodes; nodeIndex++){
//		for(nextNodeIndex = nodeIndex + 1; nextNodeIndex < field.numNodes; nextNodeIndex++){
//			//This needs to go here so current node will have the proper number of links each time
//			currentNode = field.nodes[nodeIndex];
//			nextNode = field.nodes[nextNodeIndex];
//			if(withinRange(currentNode, nextNode, radii) && restrictMaxNodes(currentNode, nextNode, maxConnections)){
//				//for some reason currentNode and nextNode are acting like copies, not references.  Why???
//				var edge = {
//					id: id.toString(36),
//					source: currentNode.id,
//					target: nextNode.id,
//					color: "#000000",
//					hidden: true
//				}
//				//return {
//				//	base1: base1,
//				//	base2: base2,
//				//	nodes: nodes,
//				//	numNodes: numNodes,
//				//	width: width,
//				//	height: height
//				//};
//				field.nodes[nodeIndex].links.push(nextNode);
//				field.nodes[nodeIndex].edges.push(edge);
//				field.nodes[nextNodeIndex].links.push(currentNode);
//				field.nodes[nextNodeIndex].edges.push(edge);
//				id++;
//				edges.push(edge);
//			}
//		}
//	}
//	field.edges = edges;
//	return field;
//}
//
////Checks if the bases are connected
//function checkField (field) {
//	var connected = [field.base1.id],
//		check = [field.base1],
//		checkConnected = function (link) {
//			if(connected.indexOf(link.id) === -1){
//				connected.push(link.id);
//				check.push(link);
//			}
//		},
//		links,
//		isolatedNodes;
//	while(check.length !== 0){
//		links = check.shift().links;
//		links.forEach(checkConnected);
//	}
//	isolatedNodes = ids.filter(function(id){
//		return connected.indexOf(id) === -1;
//	});
//	//Still need this to check if base2 is connected
//	field.isolatedNodes = isolatedNodes;
//	//Filter out isolated nodes
//	field.nodes = field.nodes.filter(function (node) {
//		return !~isolatedNodes.indexOf(node.id);
//	});
//	//Filter out the edges that attach isolated nodes
//	field.edges = field.edges.filter(function (edge) {
//		return !~isolatedNodes.indexOf(edge.source) && !~isolatedNodes.indexOf(edge.target);
//	})
//	return field;
//}
//
//function makeGraph (fieldOptions, radii, maxConnections){
//	var field = makeRandomField(fieldOptions);
//	field = connectField(field, radii, maxConnections);
//	// field = calculateSize(field);
//	field = checkField(field);
//	if(field.isolatedNodes.indexOf(field.base2.id) === -1){
//		revealLinks(field.base1);
//		revealLinks(field.base2);
//		return field;
//	}else{
//		return makeGraph(fieldOptions, radii);
//	}
//}
//
//var fieldOptions = {
//	width: 1000,
//	height: 500,
//	numNodes: 1000,
//	padding: 10
//};
//
//var board = makeGraph(fieldOptions, {inner: 15, outer: 126}, 4);
////Board notes
////withinRange({inner: 15, outer:30-33}) decent setting, stringy, lots of dead ends
////still need clipping of dense nodes




"use strict";

function Node(id, maxHealth, resources, x, y){
	this.id = id;
	this.maxHealth = maxHealth;
	this.health = maxHealth;
	this.links = [];
	this.playerVisibility = [];
	this.color = 'black';
	this.resources = resources;
	this.edges=[];
	this.x = x;
	this.y = y;
	this.hidden = true;
}


Object.defineProperty(Node,'x', {get: function(){
	return this.location.x;
}});

Object.defineProperty(Node,'y', {get: function(){
	return this.location.y;
}});
Node.prototype.addLink = function(arr) {
	this.links = arr
}

Node.prototype.regenerate = function(){
	setInterval(function(){
		while(this.health < this.maxHealth){
			this.health++
		}
	}, 5000/this.links.length)
}


function createHomeBases(numBases, maxHealth, resources, mapWidth, mapHeight){

	var colors = ['red', 'green', 'blue','yellow'];
	var locations = [[0,0],[mapWidth,mapHeight],[0,mapHeight],[mapWidth,0]];
	this.bases = [];
	for(var i=0; i<numBases; i++) {
		var base = new Node(Number(i).toString(36), resources, maxHealth,locations[i][0], locations[i][1]);
		base.color=colors[i];
		this.bases.push(base);
	}
}


function createNodes(numNodes, maxHealth, resources, mapWidth , mapHeight, lastHomeBaseId){

	this.ids = [];
	this.nodes = [];
	var id = lastHomeBaseId;

	for(var i=0; i< numNodes; i++){
		id++;
		var id_str = Number(id).toString(36);
		var x = Math.floor(Math.random() * mapWidth);
		var y= Math.floor(Math.random() * mapHeight);
		this.ids.push(id_str);
		this.nodes.push(new Node(id_str, maxHealth, resources, x, y));
	}

}

var baseList = new createHomeBases(2, 500, 10, 200, 200);
var nodeList = new createNodes(100, 5, 0, 200, 200, 2);



function createMap(
	radii,
	maxConnections,
	baseList,
	nodeList,
	mapWidth,
	mapHeight){

	this.maxConnections = maxConnections || Infinity;
	this.radii = radii;
	this.baseList = baseList;
	this.nodeList = nodeList;

}

createMap.prototype.withinRange = function(node1, node2, radii){
	//console.log('node2', node2);
	var dist = Math.sqrt(Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2));
	return dist < radii.outer && dist > radii.inner;
}

createMap.prototype.restrictMaxNodes = function(node1, node2, maxConnections) {
	var chanceConnect = 1;
	var node1ok = node1.links.length / maxConnections < chanceConnect;
	var node2ok = node2.links.length / maxConnections < chanceConnect;
	return node1ok && node2ok;
}

createMap.prototype.createConnection = function(id,source, target, color){
	var obj = {};
	if(!source) {
		console.log('sourceid', source)
	}

	obj.id = id;
	obj.source = source;
	obj.target = target;
	obj.color = color;
	obj.hidden = true;
	return obj;
}

createMap.prototype.getEdges = function(){
	var list = this.nodeList.nodes.concat(this.baseList.bases);

	console.log('what is this list', list);

	var edges = list.map(function(element,index,array) {
		if (index!==array.length-1) {
			var nextNode = list[index + 1];
			if (this.withinRange(element, nextNode, this.radii) && this.restrictMaxNodes(element, nextNode, this.maxConnections)) {

				//push the next node into this element's links
				element.links.push(nextNode);
				nextNode.links.push(element);

				//create the sigma line/link
				console.log(element.id, nextNode.id);
				var edge = this.createConnection(index.toString(36), element.id, nextNode.id, '#000000');
				console.log('what is ', edge);
				element.edges.push(edge);
				nextNode.edges.push(edge);
				return edge;
			}
		}
		else {
			return element;
		}

	}, this);
	edges.pop();
	return edges;
};

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




//radii,
//	maxConnections,
//	playerNum,
//	playerMaxHealth,
//	playerResources,
//	nodeNum,
//	nodeMaxHealth,
//	nodeResources,
//	mapWidth,
//	mapHeight
var board = new createMap({inner: 15, outer: 126}, 4, baseList, nodeList, 200,200);

board.edges = board.getEdges();

//console.log('board', board);
console.log('board edges', board.edges);
var s = new sigma({
	graph: board,
	renderers: [
		{
			container: document.getElementById("container"),
			type: "canvas"
		}
	]
});

