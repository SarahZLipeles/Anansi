define([], function () {
	var Loop = function (sigma) {
		this.end = setInterval(sigma.refresh.bind(sigma, {partial: true}), 1000 / 20);
	};

	Loop.prototype.stop = function () {
		clearInterval(this.end);
	};

	return Loop;
});