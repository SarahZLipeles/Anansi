var gameSettings = require("../../settings.js");
(function () {
    "use strict";
    var defaultColor = gameSettings.default;
    sigma.utils.pkg("sigma.svg.edges");

    /**
    * Custom game edge renderer
    */
    sigma.svg.edges.gameEdge = {
        /**
        * SVG Element creation.
        *
        * @param  {object}                   edge       The edge object.
        * @param  {object}                   source     The source node object.
        * @param  {object}                   target     The target node object.
        * @param  {configurable}             settings   The settings function.
        */
        create: function(edge, source, target, settings) {
            var arrowContainer = document.getElementById("sigma-group-arrows");
            var color = settings("defaultEdgeColor"),
            prefix = settings("prefix") || "";


            //Calculate needed points
            var sourceX = source[prefix + "x"],
                sourceY = source[prefix + "y"],
                targetX = target[prefix + "x"],
                targetY = target[prefix + "y"],
                headlen = 13,
                halfX = (sourceX + targetX) / 2,
                halfY = (sourceY + targetY) / 2,
                angle = Math.atan2(targetY - sourceY, targetX - sourceX);
                var toSourceStartPoint = (halfX - headlen * Math.cos(angle - Math.PI / 6)) + "," + (halfY - headlen * Math.sin(angle - Math.PI / 6)),
                toSourceEndPoint = (halfX - headlen * Math.cos(angle + Math.PI / 6)) + "," + (halfY - headlen * Math.sin(angle + Math.PI / 6)),
                toTargetStartPoint = (halfX + headlen * Math.cos(angle - Math.PI / 6)) + "," + (halfY + headlen * Math.sin(angle - Math.PI / 6)),
                toTargetEndPoint = (halfX + headlen * Math.cos(angle + Math.PI / 6)) + "," + (halfY + headlen * Math.sin(angle + Math.PI / 6)),
                halfPoint = halfX + "," + halfY;
            //Create svg elements
            var line = document.createElementNS(settings("xmlns"), "line");
            var arrowToSource = document.createElementNS(settings("xmlns"), "polyline");
            var arrowToTarget = document.createElementNS(settings("xmlns"), "polyline");
            //Build point strings for arrows
            var toSourcePoints = toSourceStartPoint + " " + halfPoint + " " + toSourceEndPoint;
            var toTargetPoints = toTargetStartPoint + " " + halfPoint + " " + toTargetEndPoint;
            //Set up the to source arrow
            arrowToSource.setAttributeNS(null, "points", toSourcePoints);
            arrowToSource.setAttributeNS(null, "class", settings("classPrefix") + "-arrow");
            arrowToSource.setAttributeNS(null, "stroke", color);
            arrowToSource.setAttributeNS(null, "stroke-width", "4px");
            arrowToSource.setAttributeNS(null, "fill", "none");
            arrowToSource.setAttributeNS(null, "display", "none");
            //Set up the to target arrow
            arrowToTarget.setAttributeNS(null, "points", toTargetPoints);
            arrowToTarget.setAttributeNS(null, "class", settings("classPrefix") + "-arrow");
            arrowToTarget.setAttributeNS(null, "stroke", color);
            arrowToTarget.setAttributeNS(null, "stroke-width", "4px");
            arrowToTarget.setAttributeNS(null, "fill", "none");
            arrowToTarget.setAttributeNS(null, "display", "none");
            //Add arrows to board
            arrowContainer.appendChild(arrowToTarget);
            arrowContainer.appendChild(arrowToSource);
            //Setting up the line attributes
            line.setAttributeNS(null, "data-edge-id", edge.id);
            line.setAttributeNS(null, "class", settings("classPrefix") + "-edge");
            line.setAttributeNS(null, "stroke", color);
            line.setAttributeNS(null, "stroke-width", "4px");
            line.setAttributeNS(null, "display", "none");
            //Took this from below, makes dragging and zooming possible
            //Would need to put this back to reenable that
            line.setAttributeNS(null, "stroke-width", "5px");
            line.setAttributeNS(null, "x1", sourceX);
            line.setAttributeNS(null, "y1", sourceY);
            line.setAttributeNS(null, "x2", targetX);
            line.setAttributeNS(null, "y2", targetY);
            line.setAttributeNS(null, "stroke-dasharray", "0.1 1000");

            edge.arrows = {toSource: arrowToSource, toTarget: arrowToTarget};
            return line;
        },

        /**
        * SVG Element update.
        *
        * @param  {object}                   edge       The edge object.
        * @param  {DOMElement}               line       The line DOM Element.
        * @param  {object}                   source     The source node object.
        * @param  {object}                   target     The target node object.
        * @param  {configurable}             settings   The settings function.
        */
        update: function(edge, line, source, sourceSVG, target, targetSVG, settings) {
            var sourceOwner = source.owner,
                targetOwner = target.owner,
                player = settings("player");
            if(targetOwner && targetOwner === sourceOwner){// && !edge.arrow){
                var ownerColor = settings(sourceOwner);
                line.setAttributeNS(null, "stroke", ownerColor);
                //Only show arrows if the line belongs to the player
                if(sourceOwner === player){
                    //toSource
                    if(target.from === source.id){
                        edge.arrows.toSource.setAttributeNS(null, "stroke", ownerColor);
                        edge.arrows.toSource.setAttributeNS(null, "display", "block");
                    //toTarget
                    }else if(source.from === target.id){
                        edge.arrows.toTarget.setAttributeNS(null, "stroke", ownerColor);
                        edge.arrows.toTarget.setAttributeNS(null, "display", "block");
                    }
                }
            }else{
                line.setAttributeNS(null, "stroke", defaultColor);
                edge.arrows.toSource.setAttributeNS(null, "display", "none");
                edge.arrows.toTarget.setAttributeNS(null, "display", "none");
            }
            //If either node belongs to the player, show the line
            if(targetOwner === player || sourceOwner === player){
                line.setAttributeNS(null, "display", "block");
                setTimeout(function() {line.setAttributeNS(null, "stroke-dasharray", "1000 1000");}, 100);
            }else{
                line.setAttributeNS(null, "display", "none");
                line.setAttributeNS(null, "stroke-dasharray", "0.1 1000");
            }

            return this;
        }
    }
})();
