
var crawl = function(node) {
	queue = [];
	var crawlLayer = function(claimedNode) {
		queue = queue.concat(claimedNode.links);
	};
	crawlLayer(claimNode(node));
	while (queue.length > 0) {
		crawlLayer(claimNode(queue.unshift()));
	}
};