var editorController = require("./editor.controller");

var editor = {name: "editor"};
editor.func = function(){
    return {
        restrict: 'E',
        templateUrl: '/app/play/editor/editor.html',
        controller: editorController
    };
};
module.exports = editor;
