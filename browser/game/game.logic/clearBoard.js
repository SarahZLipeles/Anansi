module.exports = function () {
	var gameContainer = document.getElementById("container");
	while (gameContainer.firstChild) {
		gameContainer.removeChild(gameContainer.firstChild);
	}
};