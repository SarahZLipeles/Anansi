define(["app/play/editor/editor.controller"], function (editorController) {
    var editor = {name: "editor"};
    editor.func = function(){
        return {
            restrict: 'E',
            templateUrl: '/app/play/editor/editor.html',
            controller: editorController
        }
    };
    return editor;
});
