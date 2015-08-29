function loadingOn() {
    document.getElementById("loading").style.display = "block";
    document.getElementById("victory").style.display = "none";
    document.getElementById("defeat").style.display = "none";
}

function loadingOff() {
    document.getElementById("loading").style.display = "none";
}

function endGame (result) {
	if(result === "victory"){
		document.getElementById("victory").style.display = "block";
	}else if(result === "defeat"){
		document.getElementById("defeat").style.display = "block";
	}
}

module.exports = {
	loading: {
		on: loadingOn,
		off: loadingOff
	},
	endGame: endGame
}