var navbar = {name: "navbar"};

navbar.$inject = ["$rootScope","AuthService", "AUTH_EVENTS", "$state"];

navbar.func = function ($rootScope, AuthService, AUTH_EVENTS, $state) {
    return {
        restrict: 'E',
        templateUrl: '/app/navbar/navbar.html',
        link: function(scope) {
            scope.user = null;

            scope.categories = [{
                label: 'Editor',
                state: 'editor',
                auth: scope.user
            }, {
                label: 'Play Game',
                state: 'play',
                auth: scope.user
            }, {
                label: 'Quit',
                state: 'homepage',
                auth: scope.user
            }, {
                label: 'Login',
                state: 'login',
                auth: !scope.user
            }, {
                label: 'Signup',
                state: 'signup',
                auth: !scope.user
            }
            ];


            scope.isLoggedIn = function() {
                return AuthService.isAuthenticated();
            };

            scope.logout = function() {
                AuthService.logout().then(function() {
                    $state.go('home');
                });
            };

            var setUser = function() {
                AuthService.getLoggedInUser().then(function(user) {
                    scope.user = user;
                });

            };

            var removeUser = function() {
                scope.user = null;
            };

            setUser();

            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

        }
    };
};

module.exports = navbar;
