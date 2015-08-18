app.directive('editor', function(){
    return {
        restrict: 'E',
        templateUrl: '/app/play/editor/editor.html',
        controller: function($scope, $element) {
            $scope.reset = function(){
                $scope.func = null;
            }
            $scope.createFunction = function(func){
                var data = {}
                $scope.data = angular.copy(func.data);
                console.log($scope.data);
                eval($scope.data);
            }
        }
    }
})