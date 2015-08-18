app.directive('navbar', function(){
    return {
        restrict: 'E',
        templateUrl: '/app/navbar/navbar.html',
        link: function(scope) {
            scope.categories = [{
                label: 'Play',
                state: 'editor'
            }, {
                label: 'Signup',
                state: 'signup'
            }, {
                label: 'Login',
                state: 'login'
            }]
        }
    }
});