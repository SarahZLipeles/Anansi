app.directive('navbar', function(){
    return {
        restrict: 'E',
        templateUrl: '/app/navbar/navbar.html',
        link: function(scope) {
            scope.categories = [{
                label: 'Join Game',
                state: 'joinGame'
            }, {
                label: 'Create User',
                state: 'createUser'
            }, {
                label: 'Login',
                state: 'login'
            }]
        }
    }
});