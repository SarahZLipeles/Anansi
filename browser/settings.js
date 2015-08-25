var settings = {
	//colors
	default: "#000000",
	host: "#119900",
	client: "#aa1122",
	
	//node settings
	//starting health
	health: 20,
	maxHealth: 20,
	baseHealth: 50,
	baseMaxHealth: 50,

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
	attackBy: 5,
	reinforceBy: 10,
	healthOnClaim: (maxHealth) => return maxHealth / 4,

	//number of threads
	numThreads: 2,

};

module.exports = settings;
