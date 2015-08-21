"use strict";
var requirejs = require("requirejs");
var expect = require("chai-expect")

requirejs.config({
	baseUrl: "../../../../",
	nodeRequire: require
});

describe("Node Factories", function () {
	var BuildNodeFactory;

	setup(function (done) {
		requirejs(["../../../../browser/game/game.components/node"], function (modu) {
			BuildNodeFactory = modu;
			done();
		});
	});

	describe("Random distribution factory", function () {
		var RandomFactory, nodes;
		setup(function () {
			RandomFactory = BuildNodeFactory({
				fieldType: "random",
				width: 100,
				height: 100,
				numNodes: 100
			});
			var base = RandomFactory(true);
			nodes.push(base);
			var node = RandomFactory();
			while(node){
				nodes.push(node);
				node = RandomFactory();
			}
		});

		it("Should produce the correct number of nodes", function () {
			expect(nodes.length).to.equal(100);
		});

		it("Should only produce nodes within the board's bounds", function () {

		});
		it("Should correctly id each node", function () {

		});
		it("Should add base attributes to a base node", function () {

		});
	});


	

});
