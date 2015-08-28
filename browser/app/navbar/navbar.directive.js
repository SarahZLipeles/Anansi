var navbar = {name: "navbar"};

navbar.$inject = ["$rootScope", "$state"];

navbar.func = function ($rootScope, $state) {
    return {
        restrict: 'E',
        templateUrl: '/app/navbar/navbar.html',
        link: function(scope) {
            scope.user = null;

            scope.categories = [{
                label: 'Editor',
                state: 'editor',
                auth: true
            }, {
                label: 'Play Game',
                state: 'play',
                auth: true
            }, {
                label: 'Quit',
                state: 'homepage',
                auth: true,
                pos: "nav-right"
            }
            ];
        }
    };
};

module.exports = navbar;
