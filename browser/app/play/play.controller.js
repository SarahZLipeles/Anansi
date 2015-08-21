var Crawlers = require("./editor/crawlersFactory");

var playController = function($scope) {
    $scope.crawlers = Crawlers.crawlers;
};

playController.$inject = ["$scope"];

module.exports = playController;
