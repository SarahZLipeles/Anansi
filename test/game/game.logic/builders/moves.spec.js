"use strict";
var expect = require("chai").expect;
var path = require("path");
var dir = require("../../game.paths");
var makeMoves = require(path.join(dir.builders, "moves"));

describe("Moves", () => {
	var queue, nodes, board, moves,
		host, node1, node2, node3, nodeBranch, node4, client, node6, node7;

	beforeEach(() => {
		host = {id: 0, links: [1], health: 50, maxHealth: 50, to: [], from: 0, owner: "host"},
		node1 = {id: 1, links: [0, 2], health: 10, maxHealth: 10, to: [], from: undefined, owner: undefined},
		node2 = {id: 2, links: [1, 3], health: 10, maxHealth: 10, to: [], from: undefined, owner: undefined},
		node3 = {id: 3, links: [2, 4, 8], health: 10, maxHealth: 10, to: [], from: 4, owner: "client"},
		nodeBranch = {id: 8, links: [3, 4], health: 10, maxHealth: 10, to: [], from: 8, owner: "host"},
		node4 = {id: 4, links: [3, 5, 8], health: 10, maxHealth: 10, to: [3], from: 5, owner: "client"},
		client = {id: 5, links: [4, 6, 7], health: 50, maxHealth: 50, to: [4, 6], from: 5, owner: "client"},
		node6 = {id: 6, links: [5], health: 10, maxHealth: 10, to: [], from: 5, owner: "client"},
		node7 = {id: 7, links: [5], health: 10, maxHealth: 10, to: [], from: 7, owner: "host"},
		board = {
			nodes: [host, node1, node2, node3, nodeBranch, node4, client, node6, node7],
			bases: {host: host.id, client: client.id}
		};
		queue = nodes = (id) => {
			return board.nodes.find((node) => id === node.id);
		};
		moves = makeMoves({queue: queue, nodes: nodes})
	});
	

	describe("Creates move functions", () => {
		it("Should properly expose the moves as functions", function () {
			expect(moves.attack).to.be.a("function");
			expect(moves.reinforce).to.be.a("function");
		});
	});

	describe("Attack", () => {

		describe("gives the proper responses", () => {

			xit("gives valid attack responses", () => {
				var validAttack = {source: 0, target: 1, player: "host"};
			});

			xit("prevents attacks from neutral", () => {
				var attackFromNeutral = {source: 2, target: 3, player: "host"};
			});

			xit("prevents non-linked attacks", () => {
				var invalidAttack = {source: 0, target: 4, player: "host"};
			});

			xit("prevents friendly attacks", () => {
				var attackSelf = {source: 5, target: 4, player: "client"};
			});

			xit("prevents attacks from an opponent held node", () => {
				var attackFromOppNode = {source: 6, target: 5, player: "host"}
			});
			
		});

		it("damages a node and doesn't claim it when its health is above 0", () => {
			var attack = {source: 0, target: 1};
			moves.attack(attack);
			expect(node1.health).to.equal(5);
			expect(node1.owner).to.be.undefined;
		});

		it("claims a neutral node when it knocks its health to or below 0", () => {
			var attack1 = {source: 0, target: 1};
			node1.health = 4;
			moves.attack(attack1);
			expect(node1.health).to.equal(5);
			expect(node1.owner).to.equal("host");
			var attack2 = {source: 1, target: 2};
			moves.attack(attack2);
			moves.attack(attack2);
			expect(node2.health).to.equal(5);
			expect(node2.owner).to.equal("host");
		});

		xit("claims an occupied node with 0 health or less", () => {

		});

		xit("doesn't claim a neutral node without 0 health", () => {
			
		})

		xit("claims an occupied node and cuts the from chain", () => {

		});

		xit("claims an opponents base and removes all connected nodes", () => {

		});

	});

	describe("Reinforce", () => {

		xit("reinforces a node you own", () => {

		});

		xit("doesn't raise the health of a node you own over its maxHealth", () => {

		});

		xit("doesn't reinforce a node you don't own", () => {

		});

	})

	

});
