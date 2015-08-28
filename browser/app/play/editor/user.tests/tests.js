var buildUserScope = require("../../../../game/game.logic/builders/userScope");
var webworkify = require("webworkify");

function userTests(obj) {

    try {
        var worker = webworkify(require("./boardTest.js"));
        worker.addEventListener("message", receiveNotifications);
        worker.postMessage(["(function(nodeId, data){" + addThis(obj.startText) + "})", "(function(node, data) {" + addThis(obj.receiveText) + "})"]);
        obj.start = eval("(function(nodeId, data){" + addThis(obj.startText) + "})");
        obj.receive = eval("(function(node, data) {" + addThis(obj.receiveText) + "})");

    } catch (e) {
        alert("Your crawler errored out with the following error:\n" + e);
        return false;
    }

    return obj;
}

function receiveNotifications(str) {
    console.log(str);
    if (str === "claimed all nodes") {
        worker.terminate();
    }
}


// RegExp's
var windowKeys = Object.keys(window.__proto__);
var dissallowedStr = "(this|window|self|eval|arguments|document|parseInt|Number|toString|throw|Error|eval|Infinity|__proto__|new|console|";
for (var i = 0; i < windowKeys.length; i++) {
    dissallowedStr += windowKeys[i] + "|";
}
dissallowedStr = dissallowedStr.slice(0, -1) + ")";
var restrictedFinder = new RegExp(dissallowedStr);
var scopeMethodFinders = [];
var userScope = buildUserScope();
var userScopeKeys = Object.keys(userScope);
for (i = 0; i < userScopeKeys.length; i++) {
    scopeMethodFinders.push(new RegExp("(" + userScopeKeys[i] + ")", "g"));
}

var hasRestricted = function(str) {
    return restrictedFinder.exec(str);
};

var addThis = function(str) {
    for (var i = 0; i < scopeMethodFinders.length; i++) {
        str = str.replace(scopeMethodFinders[i], "this.$1");
    }
    return str;
};

module.exports = userTests;