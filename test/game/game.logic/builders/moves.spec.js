"use strict";
var expect = require("chai").expect;
var path = require("path");
var dir = require("../../game.paths");
var makeMoves = require(path.join(dir.builders, "moves"));

describe("Moves", () => {
	var queue, nodes, board, moves,
		host, node1, node2, node3, nodeBranch, node4, client, node6, node7, node9;

	beforeEach(() => {
		host = {id: 0, links: [1], health: 50, maxHealth: 50, to: [], from: 0, owner: "host"},
		node1 = {id: 1, links: [0, 2], health: 10, maxHealth: 20, to: [], from: undefined, owner: undefined},
		node2 = {id: 2, links: [1, 3], health: 10, maxHealth: 20, to: [], from: undefined, owner: undefined},
		node3 = {id: 3, links: [2, 4], health: 10, maxHealth: 20, to: [], from: 4, owner: "client"},
		nodeBranch = {id: 8, links: [4], health: 10, maxHealth: 20, to: [], from: 8, owner: "host"},
		node4 = {id: 4, links: [3, 5, 8], health: 10, maxHealth: 20, to: [3], from: 5, owner: "client"},
		client = {id: 5, links: [4, 6, 9], health: 50, maxHealth: 50, to: [4, 6], from: 5, owner: "client"},
		node6 = {id: 6, links: [5, 7], health: 10, maxHealth: 20, to: [7], from: 5, owner: "client"},
		node7 = {id: 7, links: [6], health: 10, maxHealth: 20, to: [], from: 6, owner: "client"},
		node9 = {id: 9, links: [5], health: 10, maxHealth: 20, to: [], from: 9, owner: "host"},
		board = {
			nodes: [host, node1, node2, node3, nodeBranch, node4, client, node6, node7, node9],
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

			it("gives valid attack responses", () => {
				var validAttack = {source: 0, target: 1, role: "host"};
				var res = moves.attack(validAttack);
				expect(res.message).to.equal("damaged");
				expect(res.id).to.equal(1);
				expect(res.health).to.equal(5);
				expect(res.links).to.be.undefined;
				res = moves.attack(validAttack);
				expect(res.message).to.equal("claimed");
				expect(res.id).to.equal(1);
				expect(res.health).to.be.undefined;
				expect(res.links).to.be.an("array");
			});

			it("prevents attacks from neutral", () => {
				var attackFromNeutral = {source: 2, target: 3, role: "host"};
				var res = moves.attack(attackFromNeutral);
				expect(res.id).to.equal(3);
				expect(res.message).to.equal("invalid");
				expect(res.links).to.be.undefined;
				expect(res.health).to.be.undefined;
			});

			it("prevents non-linked attacks", () => {
				var invalidAttack = {source: 0, target: 4, role: "host"};
				var res = moves.attack(invalidAttack);
				expect(res.id).to.equal(4);
				expect(res.message).to.equal("invalid");
				expect(res.links).to.be.undefined;
				expect(res.health).to.be.undefined;
			});

			it("prevents friendly attacks", () => {
				var attackSelf = {source: 5, target: 4, role: "client"};
				var res = moves.attack(attackSelf);
				expect(res.id).to.equal(4);
				expect(res.message).to.equal("invalid");
				expect(res.links).to.be.undefined;
				expect(res.health).to.be.undefined;
			});

			it("prevents attacks from an opponent held node", () => {
				var attackFromOppNode = {source: 6, target: 5, role: "host"};
				var res = moves.attack(attackFromOppNode);
				expect(res.id).to.equal(5);
				expect(res.message).to.equal("invalid");
				expect(res.links).to.be.undefined;
				expect(res.health).to.be.undefined;
			});
			
		});

		it("damages a node and doesn't claim it when its health is above 0", () => {
			var attack = {source: 0, target: 1, role: "host"};
			moves.attack(attack);
			expect(node1.health).to.equal(5);
			expect(node1.owner).to.be.undefined;
		});

		it("claims a neutral node when it knocks its health to or below 0", () => {
			var attack1 = {source: 0, target: 1, role: "host"};
			node1.health = 4;
			moves.attack(attack1);
			expect(node1.health).to.equal(5);
			expect(node1.owner).to.equal("host");

			var attack2 = {source: 1, target: 2, role: "host"};
			moves.attack(attack2);
			moves.attack(attack2);
			expect(node2.health).to.equal(5);
			expect(node2.owner).to.equal("host");
		});

		it("claims an occupied node and cuts the from chain", () => {
			var attack = {source: 8, target: 4, role: "host"};
			moves.attack(attack);
			moves.attack(attack);
			//Adds to the to array of the attacker
			expect(nodeBranch.to[0]).to.equal(4);
			expect(nodeBranch.to).to.have.length(1);
			expect(nodeBranch.health).to.equal(10);
			expect(nodeBranch.from).to.equal(8);
			expect(nodeBranch.links).to.have.length(1);
			//Manipulates the target
			expect(node4.to).to.have.length(0);
			expect(node4.from).to.equal(8);
			expect(node4.health).to.equal(5);
			expect(node4.links).to.have.length(3);
			expect(node4.owner).to.equal("host");
			//Doesn't travel down the from chain, but cuts the to chain
			expect(client.owner).to.equal("client");
			expect(client.to[0]).to.equal(6);
			expect(client.to).to.have.length(1);
			//Travels down the to chain
			expect(node3.health).to.equal(10);
			expect(node3.from).to.be.undefined;
			expect(node3.owner).to.be.undefined;
			expect(node3.to).to.have.length(0);
		});

		it("claims an opponents base and removes all connected nodes", () => {
			var sneakAttack = {source: 9, target: 5, role: "host"};
			//client owns nodes 3, 4, 6, client
			client.health = 9;
			moves.attack(sneakAttack);
			moves.attack(sneakAttack);
			//Proper attacker result
			expect(node9.to).to.have.length(1);
			expect(node9.to[0]).to.equal(5);
			//The network dies
			expect(node3.from).to.be.undefined;
			expect(node3.owner).to.be.undefined;
			expect(node3.to).to.have.length(0);
			expect(node4.from).to.be.undefined;
			expect(node4.owner).to.be.undefined;
			expect(node4.to).to.have.length(0);
			expect(node6.from).to.be.undefined;
			expect(node6.owner).to.be.undefined;
			expect(node6.to).to.have.length(0);
			expect(node7.from).to.be.undefined;
			expect(node7.owner).to.be.undefined;
			expect(node7.to).to.have.length(0);
			expect(client.from).to.equal(9);
			expect(client.owner).to.equal("host");
			expect(client.to).to.have.length(0);
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
