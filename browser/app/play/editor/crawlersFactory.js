function Crawlers() {
	this.crawlers = [];
	var makeCrawler = function(obj) {
		var data = {};
		return {
			name: obj.name,
			start: function(nodeId, base) {
				obj.start.call(this, nodeId, base, data);
			},
			receive: function(node) {
				console.log(this);
				obj.receive.call(this, node, data);
			},
			description: obj.description
		};
	};

	var defaultCrawler = makeCrawler({
		start: function(id, base) {
			this.attack(base, id);
		},
		receive: function() {}
	});

	this.addCrawler = function(obj) {
		this.crawlers.push(makeCrawler(obj));
	};
	this.getCrawler = function(name) {
		var found = this.crawlers.find((crawler) => {return crawler.name === name; });
		return found || defaultCrawler;
	};
}
var C = new Crawlers();

module.exports = C;
