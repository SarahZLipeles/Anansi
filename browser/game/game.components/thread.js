
var buildUserScope = require("../game.logic/builders/userScope");
var id = 0;
function Thread(handler) {
    this.id = id++;
    this.crawling = false;
    this.currentCrawler;
    this.handler = handler;
    this.userScope = buildUserScope(handler, this.id);

    handler.register(this);
}

Thread.prototype.crawl = function(startId, crawler, base) {
    if (this.crawling) {
        this.handler.clearThread(this.id);
    }
    this.crawling = true;
    this.currentCrawler = crawler;
    console.log(base, crawler, this.userScope, startId);
    crawler.start.call(this.userScope, startId, base);
};

Thread.prototype.stop = function () {
    this.currentCrawler = undefined;
    this.crawling = false;
    this.handler.clearThread(this.id);
}

module.exports = Thread;
