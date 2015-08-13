"use strict";


function createHomeBases(numBases, maxHealth, mapWidth, mapHeight){

	var colors = ['red', 'green', 'blue','yellow'];
	var locations = [[0,0],[mapWidth,mapHeight],[0,mapHeight],[mapWidth,0]];
	this.bases = [];
	for(var i=0; i<numBases; i++) {
		var base = new Node(Number(i).toString(36),maxHealth,locations[i]);
		base.color=colors[i];
		this.bases.push(base);
	}
}


function createNodes(numNodes, maxHealth, mapWidth , mapHeight, lastHomeBaseId){

	this.ids = [];
	this.nodes = [];
	var id = lastHomeBaseId;

	for(var i=0; i< numNodes, i++){
		id++;
		id = Number(id).toString(36);
		var x = Math.floor(Math.random() * mapWidth);
		var y= Math.floor(Math.random() * mapHeight);
		this.ids.push(id);
		this.nodes.push(new Node(id, maxHealth, mapWidth, mapHeight));
	}

}


function createMap(
	radii,
	maxConnections,
	players,
	playerMaxHealth,
	nodes,
	nodeMaxHealth,
	mapWidth,
	mapHeight){

	this.maxConnections = maxConnections || Infinity;
	this.radii = radii;
	this.baseList = new createHomeBases(players, playerMaxHealth, 10, mapWidth, mapHeight);
	this.nodeList = new createNodes(nodes, nodeMaxHealth, 0 ,mapWidth, mapHeight);

}

createMap.prototype.withinRange = function(node1, node2, radii){
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
	this.id=id;
	this.source=source;
	this.target=target;
	this.color=color;
	this.hidden=true;
}

createMap.prototype.edges = function(nodeList, baseList){
	nodeList.nodes.unshift(baseList.bases);
	var edges = nodeList.nodes.map(function(element,index,array) {

		if (index!==array.length) {
			var nextNode = nodeList.nodes[index + 1];
			if (this.prototype.withinRange(element, nextNode, this.radii) && this.prototype.restrictMaxNodes(element, nextNode, this.maxConnections)) {

				//push the next node into this element's links
				element.links.push(nextNode);
				nextNode.links.push(element);

				//create the sigma line/link
				var edge = new this.prototype.createConnection(index.toString(36), element, nextNode, '#000000');
				element.edges.push(edge);
				nextNode.edges.push(edge);
				return edge;
			}
		}
		else {
			return element;
		}

	})(this).pop();

	return edges;
};

var board = new createMap({inner: 15, outer: 126}, 4, 2, 500, 100,200,200);
\