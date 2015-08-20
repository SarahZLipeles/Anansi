define(["js/game.components/style"], function (style) {
    var defaultColor = style.default;
    function Thread(speed, graph, claim) {
        var crawlQ = [];
        var nodes = graph.nodes;
        var currentCrawler;
        var attackNode = function(sourceId, destId) {
            var source = nodes(sourceId);
            var node = nodes(destId);
            if(source.links.indexOf(destId) !== -1){
                var attk = function() {
                    console.log(node.health);
                    if (node.health > 0) {
                        node.health -= 5;
                        crawlQ.push(attk);
                    }
                    if (node.health <= 0) {
                        // node.health = 6;
                        claim(destId, sourceId);
                        //return links to player
                        currentCrawler.receiveLinks.call(userScope, destId, node.links);
                    }
                };
                crawlQ.unshift(attk);
            }
        };
        var removeOwner = (nodeId) => {
            var changeNode = queue(nodeId);
            changeNode.owner = undefined;
            //should flatten in the future, maybe
            changeNode.to.forEach((id) => {
                removeOwner(id);
            });
            changeNode.to.length = 0;
            changeNode.from = undefined;
        };

        var execute = (nodeid, sourceNodeid) => {
            var node = queue(nodeid);
            var sourceNode = nodes(sourceNodeid);
            var owner = sourceNode.owner;
            // if(node.id !== view.graph.bases[this.role].id){
            if(!node.from){
                node.from = sourceNode.id;
                sourceNode.to.push(node.id);
            }else if(node.from && node.owner !== owner){
                var oldFrom = nodes(node.from);
                var toIndex = oldFrom.to.indexOf(node.id);
                if(~toIndex){
                    oldFrom.to.splice(toIndex, 1);
                }
                node.from = sourceNode.id;
                sourceNode.to.push(node.id);
                for(var i = 0, l = node.to.length; i < l; i++){
                    removeOwner(node.to.pop());
                }
            }
            // } 
            node.owner = owner;
        };
        
        var reinforceNode = function(id, times) {
            if(nodes(id).color !== defaultColor){
                var reinforce = function() {
                    var node = nodes(id);
                    if (node.health < node.maxHealth) {
                        node.health+=5;
                        console.log(node.health);
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
        //to fix
        // this.moveBase = function(id){
        //     var moveTo = nodes(id);
        //     var oldBase = nodes(graph.bases[role].id);
        //     if (oldBase.links.indexOf(id) !== -1/* && moveTo.color === graph.color*/) {
        //         oldBase.size = 0.03;
        //         oldBase.from = id;
        //         var index = moveTo.to.indexOf(id);
        //         oldBase.to.splice(index,1);

        //         moveTo.size = 0.15;
        //         moveTo.from = undefined;
        //         moveTo.to.push(oldBase.id);

        //         graph.bases[role] = moveTo;
        //     }
        // };

        var userScope = {
            attackNode: attackNode,
            reinforceNode: reinforceNode
        };
        
        
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