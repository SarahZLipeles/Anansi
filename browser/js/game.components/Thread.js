define([], function () {
    var id = 0;
    function Thread(handler) {
        this.id = id++;
        this.crawling = false;
        handler.register(this);

        this.currentCrawler;

    	this.crawl = function(startId, crawler) {
    		if (this.crawling) {
    			handler.clearThread(this.id);
    		}
            this.currentCrawler = crawler;
    		this.crawling = true;

    		// crawler.start.call(userScope, startId); //NEED TO FIX
    	};
    }

    return Thread;
});