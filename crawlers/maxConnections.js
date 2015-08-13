var hey = function (event) { 
	var crawl = function(node) {
		var crawled = [];
		var queue = [];
		var maxLinks = function(arr) {
			var max = arr[0];
			for (var i = 0; i < arr.length; i++) {
				if (s.graph.nodes(arr[i]).links.length > s.graph.nodes(max).links.length) {
					max = arr[i];
				}
			}
			return max;
		};
		var crawlLayer = function(claimedNode) {
			queue = claimedNode.links.concat(queue);
		};
		crawlLayer(revealLinks(node, null, color));
		var timeout = setInterval(function() {
			if (queue.length === 0) window.clearInterval(timeout);
			console.log(queue);
			var n = s.graph.nodes(queue.splice(queue.indexOf(maxLinks(queue)), 1)[0]);
			if (crawled.indexOf(n) === -1) {
				crawlLayer(revealLinks(n , null, color));
				crawled.push(n);
			}
		}, 1);
	};
	var color  = event.data.node.color;
	crawl(event.data.node);
};
