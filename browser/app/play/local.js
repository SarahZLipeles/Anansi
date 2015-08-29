var Crawlers = require("./editor/crawlersFactory");
var userTests = require("./editor/user.tests/tests.js");

var getCrawlers = function() {
	var crawlers = [];
	var objKeys = Object.keys(localStorage);
	console.log(localStorage);
	for (var i = 0; i < objKeys.length; i++) {
	    var crawler = JSON.parse(localStorage[objKeys[i]]);
	    console.log(crawler);
	    var testedObj = userTests(crawler);
	    Crawlers.addCrawler(testedObj);
	    crawlers.push(testedObj);
	}
	return crawlers;
};


var setCrawler = function(crawler) {
	localStorage.setItem(crawler.name, JSON.stringify(crawler));
};

module.exports = {
	getCrawlers,
	setCrawler
};