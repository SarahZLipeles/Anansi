"use strict";
var expect = require("chai").expect;
var before = require("mocha").before;
var path = require("path");
var dir = require("../game.paths");
var NodesFactory = require(path.join(dir.components, "node"));

describe("Node Factory", () => {
	var getUniqueIds = (arr) => {
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
	
	
	describe("Creates a field of nodes from accurate parameters", () => {
		var result,
			width = 200,
			height = 200;
		before(() => {
			result = NodesFactory({
				width: width,
				height: height,
				nodeSize: 5,
				spacing: 10
			});
		});

		it("Should produce the correct number of nodes", () => {
			expect(result.nodes).to.have.length.of.at.least(50);
		});
		it("Should only produce nodes within the board's bounds", () => {
			var outOfBounds = result.nodes.filter((node) => {
				return node.x < 0 || node.x > width || node.y < 0 || node.y > height; 
			});
			expect(outOfBounds).to.be.empty;
		});
		it("Should uniquely id each node", () => {
			var uniqueIds = getUniqueIds(result.nodes);
			expect(uniqueIds.length).to.equal(result.nodes.length);
		});
		it("Should give back 2 bases", () => {
			expect(result.base1).to.be.an("object");
			expect(result.base2).to.be.an("object");
		})
		it("Should choose 2 bases from the board", () => {
			var bases = result.nodes.filter((node) => {
				return node.id === result.base1.id || node.id === result.base2.id;
			});
			expect(bases.length).to.equal(2);
		});
		it("Should add base attributes to a base node", () => {
			var notBases = result.nodes.filter((node) => {
				return node.id !== result.base1.id && node.id !== result.base2.id;
			});
			expect(result.base1.health).to.be.above(notBases[0].health);
			expect(result.base1.maxHealth).to.be.above(notBases[1].maxHealth);
			expect(result.base2.health).to.be.above(notBases[2].health);
			expect(result.base2.maxHealth).to.be.above(notBases[3].maxHealth);
		});
	});
});

