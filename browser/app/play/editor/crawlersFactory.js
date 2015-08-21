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
				receiveNode: function(node) {
					console.log(this);
					obj.receiveNode.call(this, node, data);
				}
			};
		};

		var defaultCrawler = makeCrawler({
			start: function(id) {
				this.attackNode(0, id);
			},
			receiveNode: function() {}
		});

		this.addCrawler = function(obj) {
			this.crawlers.push(makeCrawler(obj));
		};
		this.getCrawler = function(name) {
			for (var i = 0; i < this.crawlers.length; i++) {
				if (this.crawlers[i].name === name) return this.crawlers[i];
			}
			return defaultCrawler;
		};
	}
	var C = new Crawlers();
	return C;
});