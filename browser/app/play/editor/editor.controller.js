define([], function () {
	var editorController = function($scope) {
        $scope.reset = function(){
            $scope.func = null;
        }
        $scope.createFunction = function(func){
            $scope.data = angular.copy(func.data);
            eval($scope.data);
        }
    };

    editorController.$inject = ["$scope"];

    return editorController;
});
