"use strict";
var path = require('path');
var express = require('express');
var favicon = require("serve-favicon");

module.exports = function (app) {

    var rootPath = app.getValue('projectRoot');
    var npmPath = path.join(rootPath, './node_modules');
    var publicPath = path.join(rootPath, './public');
    var browserPath = path.join(rootPath, './browser');
    var indexHTMLPath = path.join(rootPath, './server/layout.html');

    app.setValue('indexHTMLPath', indexHTMLPath);
    app.use(favicon(app.getValue('faviconPath')));
    app.use(express.static(npmPath));
    app.use(express.static(publicPath));
    app.use(express.static(browserPath));
};
