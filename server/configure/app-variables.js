'use strict';
var path = require('path');

var rootPath = path.join(__dirname, '../../');
var indexPath = path.join(rootPath, './server/layout.html');
var faviconPath = path.join(rootPath, '/browser/asset/favicon.ico');
var env = require(path.join(rootPath, './server/env'));

module.exports = function (app) {
    app.setValue('env', env);
    app.setValue('projectRoot', rootPath);
    app.setValue('indexHTMLPath', indexPath);
    app.setValue('faviconPath', faviconPath);

};