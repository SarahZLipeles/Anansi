var Crawlers = require("./editor/crawlersFactory");
var controls = require("../../game/game.logic/initialization/controls");
var local = require("./local");

var playController = function($scope) {
    local.getCrawlers();
    $scope.crawlers = Crawlers.crawlers;

    $scope.setCrawler = function(num) {
        controls.setCrawler(num);
    };

    $scope.setThread = function(num) {
        controls.setThread(num);
    };

    $scope.stopThread = function() {
        controls.stop();
    };

    // controls.setCrawler(0);
    // controls.setThread(0);
};

playController.$inject = ["$scope"];

module.exports = playController;