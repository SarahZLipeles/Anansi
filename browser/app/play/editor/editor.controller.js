var Crawlers = require("./crawlersFactory");
var userTests = require("./user.tests/tests");
var local = require("../local");

var editorController = function($scope) {
    $scope.crawlers = [];
    $('.boardNav').remove();
    $scope.reset = function() {
        $scope.obj = {
            start: null,
            receive: null
        };
    };
    $scope.reset();
    var objKeys = Object.keys(localStorage);
    $scope.crawlers = $scope.crawlers.concat(local.getCrawlers());
    $scope.createFunction = function() {
        var testedObj = userTests($scope.obj);
        if (testedObj) {
            Crawlers.addCrawler(testedObj);
            $scope.crawlers.push(testedObj);
            local.setCrawler(testedObj);
            $scope.reset();
        }
    };
    $scope.editCrawler = function(crawler) {
        $scope.obj = crawler;
    };
};

editorController.$inject = ["$scope"];

module.exports = editorController;