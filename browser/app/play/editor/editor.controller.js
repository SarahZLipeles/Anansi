define([], function () {
	var editorController = function($scope, $element) {
        $scope.reset = function(){
            $scope.func = null;
        }
        $scope.createFunction = function(func){
            var data = {}
            $scope.data = angular.copy(func.data);
            console.log($scope.data);
            eval($scope.data);
        }
    };

    editorController.$inject = ["$scope", "$element"];

    return editorController;
});
