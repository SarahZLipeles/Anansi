"use strict";
var requirejs = require("requirejs");

requirejs.config({
	baseUrl: "../../../../",
	nodeRequire: require
});

describe("Moves", function () {
	var thread;

	setup(function (done) {
		requirejs(["../../../../browser/game/game.components/thread"], function (modu) {
			thread = modu;
			done();
		});
	});	

});
