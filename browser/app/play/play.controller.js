define(["app/play/editor/crawlersFactory"], function (Crawlers) {
	var playController = function($scope) {
        $scope.crawlers = Crawlers.crawlers;
    };

    playController.$inject = ["$scope"];

    return playController;
});
