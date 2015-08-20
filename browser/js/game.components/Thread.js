define([], function () {
    var id = 0;
    function Thread(handler) {
        this.id = id++;
        this.crawling = false;
        handler.register(this.id);

        var currentCrawler;
        // var userScope = {
        //     attackNode: attackNode,
        //     reinforceNode: reinforceNode
        // };

    	this.crawl = function(startId, crawler) {
    		if (this.crawling) {
    			handler.clearThread(this.id);
    		}
            currentCrawler = crawler;
    		this.crawling = true;
    		// crawler.start.call(userScope, startId); //NEED TO FIX
    	};
    }

    return Thread;
});