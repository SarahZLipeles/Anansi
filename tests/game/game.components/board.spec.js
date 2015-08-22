"use strict";
var requirejs = require("requirejs");
var expect = require("chai").expect;
var babel = require("babel-core");

requirejs.config({
	baseUrl: "../../../../",
	nodeRequire: require
});

describe("The board", function () {
	var board;

	before(function (done) {
		babel()
		requirejs(["../../../browser/game/game.components/board"], function (modu) {
			board = modu.generate();
			done();
		});
	});

	it("Should have an array of nodes", function () {
		expect(board.nodes).to.be.typeof("Array");
	});
	

});
