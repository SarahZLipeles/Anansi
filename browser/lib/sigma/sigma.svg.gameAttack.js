var gameSettings = require("../../settings.js");
(function () {
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
        update: function(target, source, edge, line, settings) {
            var direction = edge.target === target ? "F" : "B";
            line.classList.add("attackEdge" + direction);
            setTimeout(function() {
                line.classList.remove("attackEdge" + direction);
            }, 300);



        //     var sourceOwner = source.owner,
        //         targetOwner = target.owner,
        //         player = settings("player");
        //     if(targetOwner && targetOwner === sourceOwner){// && !edge.arrow){
        //         var ownerColor = settings(sourceOwner);
        //         line.setAttributeNS(null, "stroke", ownerColor);
        //         //Only show arrows if the line belongs to the player
        //         if(sourceOwner === player){
        //             //toSource
        //             if(target.from === source.id){
        //                 edge.arrows.toSource.setAttributeNS(null, "stroke", ownerColor);
        //                 edge.arrows.toSource.setAttributeNS(null, "display", "block");
        //             //toTarget
        //             }else if(source.from === target.id){
        //                 edge.arrows.toTarget.setAttributeNS(null, "stroke", ownerColor);
        //                 edge.arrows.toTarget.setAttributeNS(null, "display", "block");
        //             }
        //         }
        //     }else{
        //         line.setAttributeNS(null, "stroke", defaultColor);
        //         edge.arrows.toSource.setAttributeNS(null, "display", "none");
        //         edge.arrows.toTarget.setAttributeNS(null, "display", "none");
        //     }
        //     //If either node belongs to the player, show the line
        //     if(targetOwner === player || sourceOwner === player){
        //         line.setAttributeNS(null, "display", "block");
        //     }else{
        //         line.setAttributeNS(null, "display", "none");
        //     }

        //     return this;
        }
    };
})();
