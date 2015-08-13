var hey = function (event) { 
	var crawl = function(node) {
		var crawled = [];
		var queue = [];
		var crawlLayer = function(claimedNode) {
			queue = claimedNode.links.concat(queue);
		};
		crawlLayer(revealLinks(node, null, color));
		var timeout = setInterval(function() {
			if (queue.length === 0) window.clearInterval(timeout);
			console.log(queue);
			var n = queue.splice(Math.floor(Math.random() * queue.length), 1)[0];
			if (crawled.indexOf(n) === -1) {
				crawlLayer(revealLinks(s.graph.nodes(n), null, color));
				crawled.push(n);
			}
		}, 1);
	};
	var color  = event.data.node.color;
	crawl(event.data.node);
};
