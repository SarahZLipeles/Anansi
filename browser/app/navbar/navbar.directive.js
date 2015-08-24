var navbar = {name: "navbar"};
navbar.func = function () {
    return {
        restrict: 'E',
        templateUrl: '/app/navbar/navbar.html',
        link: function(scope) {
            scope.categories = [{
                label: 'Play Game',
                state: 'play'
            }, {
                label: 'Quit',
                state: 'homepage'
            }];
        }
    };
};

module.exports = navbar;
