define([], function () {

    function Thread(speed, graph) {

        var funcs = {
            attackNode: function(id) {
                crawlQ.unshift(function() {
                    if (graph.nodes(id).health > 0) {
                        graph.nodes(id).health--;
                    }
                    if (graph.nodes(id).health === 0) {
                        return graph.nodes(id).links;
                    }
                    return graph.nodes(id).health;
                });
            },
            reenforceNode: function(id) {
                crawlQ.unshift(function() {
                    if (graph.nodes(id).health < graph.nodes(id).maxHealth) {
                        graph.nodes(id).health++;
                    }
                    return graph.nodes(id).health + "/" + graph.nodes(id).maxHealth;
                });
            }
        };

        this.crawlQ = [];
        crawlTimer = setInterval(function() {
        	if (crawlQ.length > 0) {
        		crawlQ.pop()();
        	}
        }, 1000 / speed);

    	this.crawl = function(id, currentFunc) {
    		if (this.crawling) {
    			this.crawlQ = [];
    		}
    		this.crawling = true;
    		currentFunc.bind(funcs)(id);
    	};
    }
});