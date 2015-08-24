"use strict";
var expect = require("chai").expect;
var path = require("path");
var dir = require("../game.paths");
var rewire = require("rewire");
var module = rewire(path.join(dir.components, "board"));
var boards = dir.boards;

describe("The board", () => {
	var width = 200,
		height = 200,
		makeField = module.__get__("makeField"),
		connectField = module.__get__("connectField"),
		withinRange = module.__get__("withinRange"),
		wiggleNodes = module.__get__("wiggleNodes"),
		checkField = module.__get__("checkField"),
		getUniqueIds = (arr) => {
			var u = {}, a = [];
			for(var i = 0, l = arr.length; i < l; ++i){
				if(u.hasOwnProperty(arr[i].id)) {
					continue;
				}
				a.push(arr[i].id);
				u[arr[i].id] = 1;
			}
			return a;
		};

	describe("makeField", () => {
		var field = makeField({
			width: width,
			height: height,
			nodeSize: 4,
			spacing: 15,
			padding: 10
		});
		it("Should have field properties", () => {
			expect(field.bases.host).to.be.a("string");
			expect(field.bases.client).to.be.a("string");
			expect(field.nodes).to.be.an("array");
			expect(field.width).to.equal(width);
			expect(field.height).to.equal(height);
			expect(field.numNodes).to.be.a("number");
		});
		it("Should not have edges", () => {
			var linkedNodes = field.nodes.filter((node) => node.links.length !== 0);
			expect(linkedNodes).to.have.length(0);
			expect(field.edges).to.be.undefined;
		});
	});

	describe("connectField", () => {
		var field = makeField({
			width: width,
			height: height,
			nodeSize: 4,
			spacing: 15,
			padding: 10
		});
		connectField(field, {inner: 0, outer: 33});
		it("Should produce an array of edges", () => {
			expect(field.edges).to.be.an("array");
		});
		it("Should add links to most nodes", () => {
			var linkedNodes = field.nodes.filter((node) => node.links);
			expect(linkedNodes).to.have.length.above(field.nodes.length * 3 / 4);
		});
		it("Should produce edges with unique ids", () => {
			var uniqueIds = getUniqueIds(field.edges);
			expect(uniqueIds).to.have.length(field.edges.length);
		});
		it("Should not produce duplicate edges", () => {
			var uniqueEdges = field.edges.filter((edge) => {
				return field.edges.every((otherEdge) => {
					return edge.id === otherEdge.id 
						|| ((edge.target !== otherEdge.target || edge.source !== otherEdge.source) 
							&& (edge.target !== otherEdge.source || edge.source !== otherEdge.target));
				});
			});
			expect(uniqueEdges).to.have.length(field.edges.length);
		});
	});

	describe("withinRange", () => {
		var range = {inner: 5, outer: 10},
			origin = {x: 0, y: 0},
			tooClose = {x: 1, y: 1},
			tooFar = {x: 50, y: 3},
			inRange = {x: 5, y: 6};
		it("Should respond false for nodes that are too close together", () => {
			var shouldConnect = withinRange(origin, tooClose, range);
			expect(shouldConnect).to.be.false;
		});
		it("Should respond false for nodes that are too far apart", () => {
			var shouldConnect = withinRange(origin, tooFar, range);
			expect(shouldConnect).to.be.false;
		});
		it("Should respond true for nodes that are in range", () => {
			var shouldConnect = withinRange(origin, inRange, range);
			expect(shouldConnect).to.be.true;
		});
	});

	describe("wiggleNodes", () => {
		var field = makeField({
			width: width,
			height: height,
			nodeSize: 4,
			spacing: 15,
			padding: 10
		});
		connectField(field, {inner: 0, outer: 33});
		it("Should wiggle the nodes", () => {
			var initialPositions = field.nodes.map((node) => { return {x: node.x, y: node.y}; });
			wiggleNodes(field);
			var unmovedNodes = initialPositions.filter((pos, index) => pos.x === field.nodes[index].x && pos.y === field.nodes[index].y);
			expect(unmovedNodes).to.have.length.below(4);
		})
	});

	describe("checkField", () => {
		var connectedField = boards.connected,
			unconnectedField = boards.unconnected;
		it("Responds false for an unconnected field", () => {
			var isConnected = checkField(unconnectedField);
			expect(isConnected).to.be.false;
		});
		it("Responds with the field for a connected field and prunes it", () => {
			var unprunedNodes = connectedField.nodes.length;
			var unprunedEdges = connectedField.edges.length;
			var isConnected = checkField(connectedField);
			expect(unprunedNodes).to.equal(isConnected.nodes.length + 2);
			expect(unprunedEdges).to.equal(isConnected.edges.length + 1);
			expect(isConnected).to.be.an("object");
		});
	});

	describe("makeGraph", () => {
		it("Generates the board", () => {
			var field = module.generate();
			var hostNode = field.nodes.find((node) => node.id === field.bases.host);
			var clientNode = field.nodes.find((node) => node.id === field.bases.client);
			expect(field.nodes).to.be.an("array");
			expect(field.numNodes).to.equal(field.nodes.length);
			expect(field.edges).to.be.an("array");
			expect(field.width).to.be.a("number");
			expect(field.height).to.be.a("number");
			expect(field.bases.host).to.be.a("string");
			expect(field.bases.client).to.be.a("string");
			expect(hostNode).to.be.an("object");
			expect(clientNode).to.be.an("object");
		})
	});

});
