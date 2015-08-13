
var crawl = function(node) {
	links = claimNode(node).links;
	for (var i = 0; i < links.length; i++) {
		crawl(links[i]);
	}
};