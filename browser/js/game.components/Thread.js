// <<<<<<< HEAD
define([], function () {
    var id = 0;
    function Thread(handler) {
        this.id = id++;
        this.crawling = false;
        handler.register(this);
// =======
// define(["js/game.components/style"], function (style) {
//     var defaultColor = style.default;
//     function Thread(speed, graph, claim) {
//         var crawlQ = [];
//         var nodes = graph.nodes;
//         var currentCrawler;
//         var attackNode = function(sourceId, destId) {
//             var source = nodes(sourceId);
//             var node = nodes(destId);
//             if(source.links.indexOf(destId) !== -1){
//                 var attk = function() {
//                     console.log(node.health);
//                     if (node.health > 0) {
//                         node.health -= 5;
//                         crawlQ.push(attk);
//                     }
//                     if (node.health === 0) {
//                         // node.health = 6;
//                         claim(destId, sourceId);
//                         //return links to player
//                         currentCrawler.receiveNode.call(userScope, {id: node.id, links: node.links});
//                     }
//                 };
//                 crawlQ.unshift(attk);
//             }
//         };
// >>>>>>> editor

        this.currentCrawler;

    	this.crawl = function(startId, crawler) {
    		if (this.crawling) {
    			handler.clearThread(this.id);
    		}
// <<<<<<< HEAD
            this.currentCrawler = crawler;
// =======
//             currentCrawler = crawler;
//             console.log(currentCrawler);
// >>>>>>> editor
            handler.update({type: "attack", source: sourceId, target: targetId, thread: this.id})
    		this.crawling = true;

    		// crawler.start.call(userScope, startId); //NEED TO FIX
    	};
    }

    return Thread;
});