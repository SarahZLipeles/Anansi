define([], function () {
	var Loop = function (sigma) {
		this.end = setInterval(sigma.renderers[0].renderUpdate.bind(sigma.renderers[0]), 1000 / 20);
	}

	Loop.prototype.stop = function () {
		clearInterval(this.end);
	}

	return Loop;
});