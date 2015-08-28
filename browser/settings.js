var settings = {
	//colors
	default: "#444444",
	player: "#3781a6",
	opponent: "#a1162e",
	
	//node settings
	//starting health
	health: 12,
	maxHealth: 12,
	baseHealth: 25,
	baseMaxHealth: 25,

	//size
	size: 1,


	//board settings
	fieldOptions: {
		width: 3000,
		height: 2000,
		spacing: 70,
		padding: 10
	},
	wiggle: 40,


	//gameplay
	//moves
	attackBy: 3,
	reinforceBy: 4.5,
	healthOnClaim: (maxHealth) => Math.floor(maxHealth / 2),
	

	//number of threads
	numThreads: 2,

	//sigma health bars
	healthBarSize: 9.25,
	highHealth: 0.5,
	highHealthColor: '#66c259',
	mediumHealth: 0.25,
	mediumHealthColor: '#adb835',
	lowHealthColor: "#fc002a"
};

module.exports = settings;
