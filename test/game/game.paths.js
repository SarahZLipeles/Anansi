var path = require("path");
require("es6-shim");
require("../shims");

module.exports = {
	components: path.join(__dirname, "../../browser/game/game.components"),
	logic: path.join(__dirname, "../../browser/game/game.logic"),
	builders: path.join(__dirname, "../../browser/game/game.logic/builders"),
	initialization: path.join(__dirname, "../../browser/game/game.logic/initialization"),
	boards: require(path.join(__dirname, "./testBoard"))
}