var defaultCrawler = {
	start: function(id, data) {
		if(this.isFriend(id)){
			data.source = id;
			this.reinforce(data.source);
		}else if(data.source){
			this.attack(data.source, id);
		}
	},
	receive: function() {},
	name: "Clicking"
};

function Crawlers() {
	this.crawlers= [];
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

	this.addCrawler = function(obj) {
		this.crawlers.push(makeCrawler(obj));
	};

	this.addCrawler(defaultCrawler);
}
var C = new Crawlers();

module.exports = C;
