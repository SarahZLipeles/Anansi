var Crawlers = require("../../../app/play/editor/crawlersFactory");
var gameSettings = require("../../../settings.js");
var Thread = require("../../game.components/thread");

var getCharCode = function (val) {
	return val.toString().charCodeAt();
};

var controls = {}, 
	crawlers = Crawlers.crawlers,
	currentConfig = {
		crawler: undefined,
		crawlerButton: undefined,
		thread: 0,
		threadButton: undefined
	},
	buttons = {};


var setControls = function (options){
	var {handler, view, basePos} = options,
		threads = [], 
		numThreads = gameSettings.numThreads,
		i, j;
	var board = document.getElementsByTagName("game")[0];
	var threadButtons = document.getElementById("threads").getElementsByTagName("button");
	currentConfig.threadButton = threadButtons[0];
	var crawlerButtons = document.getElementById("crawlers").getElementsByTagName("button");
	currentConfig.crawlerButton = crawlerButtons[0];
	buttons.threads = threadButtons;
	buttons.crawlers = crawlerButtons;
	
	var setThreadControl = function (num) {
		return function () {
			currentConfig.threadButton.className = "game-control";
			threadButtons[num].className = "game-control active";
			currentConfig.threadButton = threadButtons[num];
			currentConfig.thread = num;
		};
	};
	//Setting up the thread switching controls
	for(i = 0; i < numThreads; i++){
		threads[i] = new Thread(handler);
		controls[getCharCode(i + 1)] = setThreadControl(i);
	}
	//Setting up the focus on home control
	controls[getCharCode(" ")] = function () {
		board.scrollLeft = basePos.x;
		board.scrollTop = basePos.y;
	}

	var setCrawlerControl = function (num) {
		return function () {
			currentConfig.crawlerButton.className = "game-control";
			crawlerButtons[num].className = "game-control active";
			currentConfig.crawlerButton = crawlerButtons[num];
			currentConfig.crawler = crawlers[num];
		};
	};
	currentConfig.crawler = crawlers[0];
	var keys = ["q", "w", "e", "r", "a", "s", "d", "f"];
	var l = crawlers.length < keys.length ? crawlers.length : keys.length;
	for(j = 0; j < l; j++){
		controls[getCharCode(keys[j])] = setCrawlerControl(j);
	}

	view.bind("clickNode", function(event) {
		threads[currentConfig.thread].crawl(event.data.node.id, currentConfig.crawler);
	});

	document.addEventListener("keypress", function(e) {
		var command = controls[e.keyCode];
		if(command){ command(); }
	});
};

var setCrawler = function (num) {
	currentConfig.crawlerButton.className = "game-control";
	buttons.crawlers[num].className = "game-control active";
	currentConfig.crawlerButton = buttons.crawlers[num];
	currentConfig.crawler = crawlers[num];
};

var setThread = function (num) {
	currentConfig.threadButton.className = "game-control";
	buttons.threads[num].className = "game-control active";
	currentConfig.threadButton = buttons.threads[num];
	currentConfig.thread = num;
};

module.exports = {
	setControls,
	setCrawler,
	setThread,
	stop: function() {
		for (var i = 0; i < threads.length; i++) {
			threads[i].stop();
		}
	}
};
