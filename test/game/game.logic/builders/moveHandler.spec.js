"use strict";
var expect = require("chai").expect;
var path = require("path");
var dir = require("../../game.paths");
var rewire = require("rewire")
var makeHandler = rewire(path.join(dir.builders, "moveHandler"));

describe("Move Handler", () => {
	var handler, opponent, options, thread1, thread2, messages,
		moveCounter = 0,
		makeThread = (id) => {
			var count = 0;
			return {
				id: id,
				count: () => {
					return count;
				},
				currentCrawler: {
					receive: () => {
						count++;
					}
				},
				userScope: {}
			}
		},
		thread1move1 = {thread: "1", type: "attack"},
		thread1move2 = {thread: "1", type: "reinforce"},
		thread2move1 = {thread: "2", type: "attack"},
		thread2move2 = {thread: "2", type: "reinforce"};  

	makeHandler.__set__("BuildMoves", () => {
		return {
			attack: () => {
				moveCounter++;
				return {type: "attack"};
			},
			reinforce: () => {
				moveCounter++;
				return {type: "reinforce"};
			}
		};
	});

	beforeEach(() => {
		moveCounter = 0;
		thread1 = makeThread(1);
		thread2 = makeThread(2);
		messages = [];
		opponent = {
			messages: messages,
			send: (move) => {
				messages.push(move);
			}
		};
		options = {opponent};
		handler = makeHandler(options);
		handler.register(thread1);
		handler.register(thread2);
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
		handler.register(thread2);
		expect(threads).to.include.keys("1", "2");
		expect(threads[1].thread).to.equal(thread1);
		expect(threads[2].thread).to.equal(thread2);
	});

	describe("Update move queue", () => {
		it("should handle when there are no moves in the queue", () => {
			var threads = handler.update(thread1move1);
			expect(threads[1].pending).to.be.an("array");
			expect(threads[1].pending).to.have.length(1);
			expect(threads[2].pending).to.be.an("array");
			expect(threads[2].pending).to.have.length(0);
		});
		it("should always add a thread's moves to the back of its queue", () => {
			handler.update(thread1move1);
			var threads = handler.update(thread1move2);
			expect(threads[1].pending).to.have.length(2);
			expect(threads[1].pending[0]).to.equal(thread1move1);
			expect(threads[1].pending[1]).to.equal(thread1move2);
		});
		it("should be able to manage multiple queues", () => {
			handler.update(thread1move1);
			handler.update(thread1move2);
			handler.update(thread2move1);
			var threads = handler.update(thread2move2);
			expect(threads[1].pending).to.have.length(2);
			expect(threads[2].pending).to.have.length(2);
			expect(threads[1].pending).to.include(thread1move1);
			expect(threads[1].pending).to.include(thread1move2);
			expect(threads[2].pending).to.include(thread2move1);
			expect(threads[2].pending).to.include(thread2move2);
		});
	});

	describe("Clear move queue", () => {
		it("should clear a thread and be able to add moves later", () => {
			handler.update(thread1move1);
			handler.update(thread1move2);
			handler.update(thread2move2);
			var threads = handler.clearThread("1");
			expect(threads[1].pending).to.have.length(0);
			expect(threads[2].pending).to.have.length(1);
			expect(threads[2].pending).to.include(thread2move2);
			threads = handler.update(thread1move1);
			expect(threads[1].pending).to.have.length(1);
			expect(threads[2].pending).to.have.length(1);
		});
	});

	describe("Executes moves", () => {
		var emptyIncoming, incomingMoves, incomingMove;
		beforeEach(() => {
			emptyIncoming = {type: "move", moves: []};
			incomingMoves = {type: "move", moves: [{type: "attack"},{type: "attack"}]};
			incomingMove = {tyep: "move", moves: [{type: "reinforce"}]};
		});
		it("handles opponent moves", () => {
			handler.execute(emptyIncoming);
			expect(moveCounter).to.equal(0);
			handler.execute(incomingMoves);
			expect(moveCounter).to.equal(2);
			handler.execute(incomingMove);
			expect(moveCounter).to.equal(3);
			expect(opponent.messages[0].moves).to.have.length(0);
			expect(opponent.messages[2].moves).to.have.length(0);
		});

		it("handles player moves", () => {
			handler.update(thread1move1);
			handler.update(thread2move1);
			handler.update(thread2move2);

			handler.execute(emptyIncoming);
			expect(moveCounter).to.equal(2);

			handler.execute(emptyIncoming);
			expect(moveCounter).to.equal(3);

			expect(thread1.count()).to.equal(1);
			expect(thread2.count()).to.equal(2);
			expect(opponent.messages).to.have.length(2);
			expect(opponent.messages[0].moves).to.have.length(2);
			expect(opponent.messages[1].moves).to.have.length(1);
		});
	});

});



