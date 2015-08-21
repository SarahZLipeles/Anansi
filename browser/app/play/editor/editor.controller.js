define(["app/play/editor/crawlersFactory"], function (Crawlers) {
	var editorController = function($scope) {
        $scope.reset = function(){
            $scope.obj = {
                start: null,
                receive: null
            };
        };
        $scope.createFunction = function(){
            $scope.obj.start = eval("(function(nodeId, data){" + $scope.obj.start + "})");
            $scope.obj.receive = eval("(function(node, data) {" + $scope.obj.receive + "})");
            console.log($scope.obj);
            Crawlers.addCrawler($scope.obj);
            $scope.reset();
        };
        $scope.reset();
        $scope.crawlers = [];
    };

    editorController.$inject = ["$scope"];

    return editorController;
});
