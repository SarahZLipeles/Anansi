var navbar = {name: "navbar"};
navbar.func = function () {
    return {
        restrict: 'E',
        templateUrl: '/app/navbar/navbar.html',
        link: function(scope) {
            scope.categories = [{
                label: 'Editor',
                state: 'editor'
            }, {
                label: 'Play Game',
                state: 'play'
            }, {
                label: 'Quit',
                state: 'homepage'
            }, {
                label: 'Login',
                state: 'login'
            }
            ];
        }
    };
};

module.exports = navbar;
