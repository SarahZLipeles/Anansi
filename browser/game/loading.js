function on() {
    document.getElementById("loading").style.display = "block";
}

function off() {
    document.getElementById("loading").style.display = "none";
}

module.exports = {
	on: on,
	off: off
}