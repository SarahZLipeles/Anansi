'use strict'

app.config(function ($stateProvider){
    $stateProvider.state('editor', {
        url: '/editor',
        templateUrl: '/app/editor/editor.html',
        controller: 'EditorCntrl'
    })
})