var loginController = function($scope, UserFactory, AuthService, $state) {
    $scope.login={};
    $scope.sendLogin = function(loginInfo){
        //
        //UserFactory.login(loginInfo.email)
        //    .then(function(response){
        //        return response.data
        //    }).then(function(data){
        //        return data;
        //    });

        $scope.error = null;


        AuthService.login(loginInfo).then(function (user) {
            console.log('logging in');
            $state.go('editor');
        }).catch(function () {
            console.log('logging error');
            $scope.error = 'Invalid login credentials.';
        });
    }
};

loginController.$inject = ["$scope","UserFactory","AuthService","$state"];


module.exports = loginController;
