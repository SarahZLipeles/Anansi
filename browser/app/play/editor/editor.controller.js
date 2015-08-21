define(["app/play/editor/crawlersFactory"], function (Crawlers) {
	var editorController = function($scope) {
        $scope.reset = function(){
            $scope.obj = {
                start: null,
                receiveNode: null
            };
        };
        $scope.createFunction = function(){
            $scope.obj.start = eval("(function(nodeId, data){" + $scope.obj.start + "})");
            $scope.obj.receiveNode = eval("(function(node, data) {" + $scope.obj.receiveNode + "})");
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
