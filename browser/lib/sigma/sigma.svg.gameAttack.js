var gameSettings = require("../../settings.js");
(function() {
    "use strict";
    var defaultColor = gameSettings.default;
    sigma.utils.pkg("sigma.svg.edges");

    /**
     * Custom game edge renderer
     */
    sigma.svg.edges.gameAttack = {
        /**
         * SVG Element update.
         *
         * @param  {string}                   target       The edge object.
         * @param  {string}                   source    The line DOM Element.
         * @param  {object}                   edge     The source node object.
         * @param  {DOMElement}               line     The target node object.
         * @param  {configurable}             settings   The settings function.
         */
        update: function(target, targetCircle, source, sourceCircle, edge, line, settings) {
            var direction = edge.target === target ? "F" : "B",
                currColor = targetCircle.getAttributeNS(null, "fill");
            sourceCircle.classList.add("pulse");
            line.classList.add("attackEdge" + direction);
            setTimeout(function() {
                line.classList.remove("attackEdge" + direction);
                sourceCircle.classList.remove("pulse");
                setTimeout(function() {
                    targetCircle.setAttributeNS(null, "fill", "#FF0F13");
                    targetCircle.classList.add("pulse");
                }, 10);
                setTimeout(function() {
                    targetCircle.setAttributeNS(null, "fill", currColor);
                    targetCircle.classList.remove("pulse");
                }, 115);
            }, 300);
        }
    };
})();