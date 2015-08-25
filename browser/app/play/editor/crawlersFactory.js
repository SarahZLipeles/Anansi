function Crawlers() {
	this.crawlers = [];
	var makeCrawler = function(obj) {
		var data = {source: undefined};
		return {
			name: obj.name,
			start: function(nodeId) {
				obj.start.call(this, nodeId, data);
			},
			receive: function(node) {
				obj.receive.call(this, node, data);
			},
			description: obj.description
		};
	};

	var defaultCrawler = makeCrawler({
		start: function(id, data) {
			if(this.isFriend(id)){
				data.source = id;
			}else if(data.source){
				this.attack(data.source, id);
			}
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
