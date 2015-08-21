define([], function () {
	function Crawlers() {
		this.crawlers = [];
		var makeCrawler = function(obj) {
			var data = {};
			return {
				name: obj.name,
				start: function(nodeId) {
					obj.start.call(this, nodeId, data);
				},
				receive: function(node) {
					console.log(this);
					obj.receive.call(this, node, data);
				}
			};
		};

		var defaultCrawler = makeCrawler({
			start: function(id) {
				this.attack(0, id);
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
	return C;
});