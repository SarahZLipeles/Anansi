define(["game/game.logic/builders/userScope"], function (buildUserScope) {
    var id = 0;
    function Thread(handler) {
        this.id = id++;
        this.crawling = false;
        this.currentCrawler;
        this.handler = handler;
        this.userScope = buildUserScope(handler, this.id);

        handler.register(this);
    }

    Thread.prototype.crawl = function(startId, crawler) {
        if (this.crawling) {
            this.handler.clearThread(this.id);
        }
        this.crawling = true;
        this.currentCrawler = crawler;
        crawler.start.call(this.userScope, startId);
    };

    Thread.prototype.stop = function () {
        this.currentCrawler = undefined;
        this.crawling = false;
        this.handler.clearThread(this.id);
    }

    return Thread;
});