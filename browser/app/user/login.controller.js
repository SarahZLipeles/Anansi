var loginController = function($scope,$http) {
    $scope.login={};
    $scope.sendLogin = function(loginInfo){
        $http.post('/user', loginInfo)
            .then(function(response){
                return response.data
            }).then(function(data){
                return data;
            });
    }
};


loginController.$inject = ["$scope", "$http"];

module.exports = loginController;
