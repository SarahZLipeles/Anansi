define([], function () {

    function Thread(speed, graph, claim, role) {
        var crawlQ = [];

        var attackNode = function(sourceId, destId) {
            var source = graph.nodes(sourceId);
            var node = graph.nodes(destId);
            if(source.links.indexOf(destId) !== -1){
                var attk = function() {
                    console.log(node.health)
                    if (node.health > 0) {
                        node.health -= 5;
                        crawlQ.push(attk);
                    }
                    if (node.health === 0) {
                        // node.health = 6;
                        claim(node, source);
                        //return links to player
                        currentCrawler.receiveLinks.call(userScope, destId, node.links);
                    }
                };
                crawlQ.unshift(attk);
            }
        };

        var reinforceNode = function(id, times) {
            if(graph.nodes(id).color !== '#000000'){
                var reinforce = function() {
                    var node = graph.nodes(id);
                    if (node.health < node.maxHealth) {
                        node.health+=5;
                        console.log(node.health)
                        if(times){
                            crawlQ.push(reinforce.bind(null, --times));
                        }else if(times === undefined){
                            crawlQ.push(reinforce);
                        }
                    }
                };
                crawlQ.unshift(reinforce);
            }
        };

        this.moveBase = function(id){
            var moveTo = graph.nodes(id);
            var oldBase = graph.nodes(graph.bases[role].id);
            if (oldBase.links.indexOf(id) !== -1/* && moveTo.color === graph.color*/) {
                oldBase.size = 0.03;
                oldBase.from = id;
                var index = moveTo.to.indexOf(id);
                oldBase.to.splice(index,1);

                moveTo.size = 0.15;
                moveTo.from = undefined;
                moveTo.to.push(oldBase.id);

                graph.bases[role] = moveTo;
            }
        };

        var userScope = {
            attackNode: attackNode,
            reinforceNode: reinforceNode
        };
        var currentCrawler;
        
        var crawlTimer = setInterval(function() {
        	if (crawlQ.length > 0) {
        		crawlQ.pop()();
        	}
        }, 1000 / speed);

    	this.crawl = function(startId, crawler) {
    		if (this.crawling) {
    			crawlQ.length = 0;
    		}
            currentCrawler = crawler;
    		this.crawling = true;
    		crawler.start.call(userScope, startId);
    	};
    }

    return Thread;
});