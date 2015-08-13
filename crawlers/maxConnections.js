var crawl = function(node) {
	queue = [];
	var crawlLayer = function(claimedNode) {
		queue = queue.concat(claimedNode.links);
	};
	crawlLayer(claimNode(node));
	while (queue.length > 0) {
		crawlLayer(claimNode(queue.splice(queue.indexOf(maxLinks(queue)), 1)));
	}
};

var maxLinks = function(arr) {
	var max = arr[0];
	for (var i = 0; i < arr.length; i++) {
		if (arr[i].links.length > max.links.length) {
			max = arr[i];
		}
	}
	return max;
};