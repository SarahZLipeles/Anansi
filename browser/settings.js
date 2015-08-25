var settings = {
	//colors
	default: "#888888",
	player: "#1e88a8",
	opponent: "#a1162e",
	
	//node settings
	//starting health
	health: 10,
	maxHealth: 10,
	baseHealth: 25,
	baseMaxHealth: 25,

	//size
	size: 5,


	//board settings
	fieldOptions: {
		width: 4000,
		height: 3000,
		spacing: 50,
		padding: 10
	},


	//gameplay
	//moves
	attackBy: 10,
	reinforceBy: 1.25,
	healthOnClaim: (maxHealth) => Math.floor(maxHealth / 2),
	

	//number of threads
	numThreads: 2,

	//sigma health bars
	healthBarSize: 3.25,
	highHealth: 0.5,
	highHealthColor: '#398c1b',
	mediumHealth: 0.25,
	mediumHealthColor: '#adb835',
	lowHealthColor: "#fc002a"
};

module.exports = settings;
