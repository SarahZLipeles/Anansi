"use strict";
var expect = require("chai").expect;
var path = require("path");
var before = require("mocha").before;
var dir = require("../../game.paths");
var rewire = require("rewire")
var makeHandler = rewire(path.join(dir.builders, "moveHandler"));

describe("Move Handler", () => {
	var handler, opponent, options, thread1, thread2,
	makeThread = (id) => {
		return {
			id: id,
			count: 0,
			currentCrawler: {
				receive: () => {
					this.count++;
				}
			}
		}
	}
	makeHandler.__set__("BuildMoves", () => {
		return {
			attack: () => {
				return {type: "attack"};
			},
			reinforce: () => {
				return {type: "reinforce"};
			}
		};
	});

	before(() => {
		thread1 = makeThread(1);
		thread2 = makeThread(2);
		opponent = {
			messages: [],
			send: (move) => {
				this.messages.push(move);
			}
		};
		options = {opponent};
		handler = makeHandler(options);
	});

	



});





