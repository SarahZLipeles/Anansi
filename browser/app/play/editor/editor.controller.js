var Crawlers = require("./crawlersFactory");
var userTests = require("./user.tests/tests");

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
        var testedObj = userTests($scope.obj);
        if (testedObj) {
            Crawlers.addCrawler(testedObj);
        $scope.crawlers.push(testedObj);
        $scope.reset();
        }
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
