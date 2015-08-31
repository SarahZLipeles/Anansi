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
            var targetType = targetCircle.getAttribute('r');
            var sourceType = sourceCircle.getAttribute('r');

            var targetPulse, sourcePulse;
            if(targetType <=13) {
                targetPulse = 'pulse';
            } else {
                targetPulse = 'base-pulse';
            }

            if(sourceType <=13) {
                sourcePulse = 'pulse';
            } else {
                sourcePulse = 'base-pulse';
            }
                sourceCircle.classList.add(sourcePulse);

            line.classList.add("attackEdge" + direction);
            setTimeout(function() {
                line.classList.remove("attackEdge" + direction);
                sourceCircle.classList.remove(sourcePulse);

                setTimeout(function() {
                    targetCircle.setAttributeNS(null, "fill", "#FF0F13");
                    targetCircle.classList.add(targetPulse);
                }, 10);
                setTimeout(function() {
                    targetCircle.setAttributeNS(null, "fill", currColor);
                    targetCircle.classList.remove(targetPulse);

                }, 115);
            }, 300);
        }
    };
})();