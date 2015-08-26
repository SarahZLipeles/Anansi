var signUpController = function($scope,$http, UserFactory) {
    $scope.login={};
    $scope.sendLogin = function(loginInfo){
        UserFactory.signUp(loginInfo)
            .then(function(response){
                return response.data
            }).then(function(data){
                return data;
            });
    }
};


signUpController.$inject = ["$scope", "$http","UserFactory"];

module.exports = signUpController;
