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

	it("has the correct properties", () => {
		expect(handler.execute).to.be.a("function");
		expect(handler.update).to.be.a("function");
		expect(handler.register).to.be.a("function");
		expect(handler.clearThread).to.be.a("function");
		expect(handler.options).to.be.an("object");
	});

	it("should register a thread", () => {
		var threads = handler.register(thread1);
		expect(threads).to.include.keys("1");
		expect(threads[1].thread).to.equal(thread1);
		handler.register(thread2);
		expect(threads).to.include.keys("1", "2");
		expect(threads[1].thread).to.equal(thread1);
		expect(threads[2].thread).to.equal(thread2);
	});

	describe("should update a thread's move queue", () => {
		var thread1move = {thread: "1", type: "attack"};
		var thread2move = {thread: "2", type: "reinforce"};
		before(() => {
			handler.register(thread1);
			handler.register(thread2);
		});
		it("should handle when there are no moves in the queue", () => {
			handler.update()
		});
		it("should always add a thread's moves to the back of its queue", () => {

		});
		it("should be able to manage multiple queues", () => {

		});
	});



});





