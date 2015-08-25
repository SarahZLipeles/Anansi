'use strict'

var editorState = function ($stateProvider){
    $stateProvider.state('editor', {
        url: '/editor',
        template: '<editor></editor>'
    });
};
editorState.$inject = ["$stateProvider"];

module.exports = editorState;

