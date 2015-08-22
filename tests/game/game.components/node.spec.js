"use strict";
var expect = require("chai").expect;
var before = require("mocha").before;
var path = require("path");
var NodesFactory = require(path.join(__dirname, "../../../browser/game/game.components/node"));

describe("Node Factory", function () {
	
	describe("Creates a field of nodes from accurate parameters", function () {
		var result;
		before(function () {
			result = NodesFactory({
				width: 200,
				height: 200
			});
		});

		it("Should produce the correct number of nodes", function () {
			expect(result.nodes.length).to.be.greater.than(100);
		});

		it("Should only produce nodes within the board's bounds", function () {

		});
		it("Should correctly id each node", function () {

		});
		it("Should add base attributes to a base node", function () {

		});
	});


	

});
