var Crawlers = require("./crawlersFactory");
var editorController = function($scope) {
    $scope.reset = function(){
        $scope.obj = {
            start: null,
            receive: null
        };
    };
    var fillThis = function(str) {
        
    };
    $scope.createFunction = function(){
        $scope.obj.start = eval("(function(nodeId, data){" + $scope.obj.startText + "})");
        $scope.obj.receive = eval("(function(node, data) {" + $scope.obj.receiveText + "})");
        console.log($scope.obj);
        Crawlers.addCrawler($scope.obj);
        $scope.crawlers.push($scope.obj);
        $scope.reset();
    };
    $scope.editCrawler = function(crawler){
        $scope.obj = crawler;
        console.log(crawler);
    };
    $scope.reset();
    $scope.crawlers = [];
};

editorController.$inject = ["$scope"];

module.exports = editorController;
