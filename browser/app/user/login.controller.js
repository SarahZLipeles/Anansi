var loginController = function($scope, UserFactory, AuthService, $state) {
    $scope.logininfo={};
    $scope.login = function(loginInfo){
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

    $scope.signup = function(loginInfo){
        UserFactory.signUp(loginInfo)
        .then(function(response){
            return response.data
        }).then(function(data){
            return data;
        });
    }
};

loginController.$inject = ["$scope","UserFactory","AuthService","$state"];


module.exports = loginController;
