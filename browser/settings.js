var settings = {
	//colors
	default: "#444444",
	player: "#3781a6",
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
		width: 400,
		height: 300,
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
	highHealthColor: '#66c259',
	mediumHealth: 0.25,
	mediumHealthColor: '#adb835',
	lowHealthColor: "#fc002a"
};

module.exports = settings;
